const express = require("express")
const os = require("os")
const mongoose = require("mongoose")
const compression = require("compression")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const { cacheGet, clearOnWrite } = require("./utills/cache")
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
//routes
const authRoutes = require("./routes/authRoute")
const newsRoutes = require("./routes/newsRoute")
const categoryRoutes = require("./routes/categoryRoutes")
const subcategoryRoutes = require("./routes/subcategoryRoutes")
const imageRoute = require("./routes/imageRoute");
const adminRoutes = require("./routes/adminAccess")

dotenv.config();

const PORT = process.env.PORT || 8080
const HOST = process.env.HOST || "0.0.0.0"
connectDB();

// behind Nginx: trust the first proxy so rate limiting sees the real visitor IP
app.set("trust proxy", 1)
app.disable("x-powered-by")

// ---- middleware ----------------------------------------------------------
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))
app.use(compression())
app.use(express.json({ limit: "2mb" }))
app.use(cookieParser());

// CORS: set CORS_ORIGINS="https://www.mpupdate.com,https://mpupdate.com" in .env (use * to allow all)
const allowed = (process.env.CORS_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean)
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowed.length === 0 || allowed.includes("*") || allowed.includes(origin)) return cb(null, true)
        if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true)
        return cb(new Error("Not allowed by CORS"))
    },
    credentials: true,
}))

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: os.tmpdir(),
        limits: { fileSize: 10 * 1024 * 1024 },
    })
)

// brute-force protection for login / OTP, and a generous global limit per IP
app.use("/api/v1/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 40, standardHeaders: true, legacyHeaders: false, message: { success: false, message: "Too many attempts, try again later." } }))
app.use("/api/v1", rateLimit({ windowMs: 60 * 1000, max: 600, standardHeaders: true, legacyHeaders: false }))

// public read APIs are cached in memory; any successful write clears the cache
app.use("/api/v1", clearOnWrite)
app.get("/api/v1/public/menu", cacheGet(300))
app.get("/api/v1/public/news", cacheGet(60))
app.get("/api/v1/public/slugs", cacheGet(300))
app.get("/api/v1/news/all", cacheGet(60))
app.get("/api/v1/category/all", cacheGet(120))
app.get("/api/v1/ads/getAll", cacheGet(60))
app.get("/api/v1/breakingNews/getAll", cacheGet(30))
app.get("/api/v1/poll/get", cacheGet(20))
app.get("/api/v1/story/getAll", cacheGet(120))
app.get("/api/v1/yt/getAll", cacheGet(300))
app.get("/api/v1/live/getAll", cacheGet(30))



// routes  
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/news", newsRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/subcategory", subcategoryRoutes)
app.use("/api/v1/image", imageRoute);
app.use("/api/v1/breakingNews", require("./routes/breakingNewsRoute"));
app.use("/api/v1/live", require("./routes/liveStream"));
app.use("/api/v1/poll", require("./routes/pollRoute"));
app.use("/api/v1/ads", require("./routes/adsRoute"));
app.use("/api/v1/yt", require("./routes/ytVideoRoute"));
app.use("/api/v1/", require("./routes/dashboardRoutes"));
app.use("/api/v1/contact", require("./routes/contactRoute"));
app.use("/api/v1/story", require("./routes/stories"));
app.use("/api/v1/public", require("./routes/public"));
app.use("/api/v1/staff", require("./routes/staff"));






// default route 
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running ..."
    })
})

// health check for Nginx / PM2 / uptime monitors
app.get("/health", (req, res) => {
    res.json({ ok: true, uptime: Math.round(process.uptime()), mongo: mongoose.connection.readyState === 1 ? "connected" : "down" })
})

const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running at ${HOST}:${PORT}`)
})

// graceful shutdown (pm2 reload / deploy)
const shutdown = () => server.close(() => mongoose.connection.close(false).then(() => process.exit(0)))
process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)
