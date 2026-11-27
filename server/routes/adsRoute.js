const { auth, requireRole, ROLES } = require("../middleware/auth");
const express = require("express")
const { createAddCtrl, getAllAds, deleteAddCtrl, getAdminAds, updateAdCtrl, clickAdCtrl } = require("../controllers/adsCtrl")
const router = express.Router()


router.post("/create", auth, requireRole(...ROLES.MANAGE), createAddCtrl)
router.get("/getAll", getAllAds)
router.get("/admin/all", auth, requireRole(...ROLES.MANAGE), getAdminAds)
router.put("/update/:id", auth, requireRole(...ROLES.MANAGE), updateAdCtrl)
router.post("/click/:id", clickAdCtrl)
router.delete("/delete/:id", auth, requireRole(...ROLES.MANAGE), deleteAddCtrl)


module.exports = router