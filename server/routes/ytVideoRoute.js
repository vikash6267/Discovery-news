const { auth, requireRole, ROLES } = require("../middleware/auth");
const express = require("express")
const { createYTVideo, getYTVideo, deleteYTVideoCtrl } = require("../controllers/ytVideoCtrl")
const router = express.Router()


router.post("/create", auth, requireRole(...ROLES.EDITORIAL), createYTVideo)
router.get("/getAll", getYTVideo)
router.delete("/delete/:id", auth, requireRole(...ROLES.EDITORIAL), deleteYTVideoCtrl)


module.exports = router