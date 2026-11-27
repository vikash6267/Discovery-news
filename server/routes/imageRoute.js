const { auth, requireRole, ROLES } = require("../middleware/auth");
const express = require("express")
const router = express.Router()



const {
    imageUpload,
    uploadImages
} = require("../controllers/imageCtrl")

router.post("/upload", auth, requireRole(...ROLES.STAFF), imageUpload)
router.post("/multi", auth, requireRole(...ROLES.STAFF), uploadImages)


// export all router
module.exports = router


