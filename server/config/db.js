const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { maxPoolSize: 20, serverSelectionTimeoutMS: 10000 });
        console.log("connection successfully!")
    } catch (error) {
        console.log(error)
        console.log("connection faild!")
        process.exit(1) // let PM2 restart us instead of running without a database

    }
}
module.exports = connectDB;
