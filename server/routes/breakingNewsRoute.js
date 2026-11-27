const { auth, requireRole, ROLES } = require("../middleware/auth");
const express = require("express")
const { createBreakingNewsCtrl, getAllBreakingNews, deleteBreakingNews, updateStatusCtrl } = require("../controllers/breakingNews")
const router = express.Router()


router.post("/create", auth, requireRole(...ROLES.EDITORIAL), createBreakingNewsCtrl)
router.get("/getAll", getAllBreakingNews)
router.delete("/delete/:id", auth, requireRole(...ROLES.EDITORIAL), deleteBreakingNews)
router.put("/update/:id", auth, requireRole(...ROLES.EDITORIAL), updateStatusCtrl)


module.exports = router