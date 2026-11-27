const { auth, requireRole, ROLES } = require("../middleware/auth");
// routesRoutes.js
const express = require('express');
const { createStoryCtrl, getAllStoryCtrl, getSingleStoryCtrl, deleteStroryCrtrl } = require('../controllers/storiesCtrl');
const router = express.Router();

router.post("/create", auth, requireRole(...ROLES.EDITORIAL), createStoryCtrl)
router.get("/getAll", getAllStoryCtrl)
router.get("/get/:id", getSingleStoryCtrl)
router.delete("/delete/:id", auth, requireRole(...ROLES.EDITORIAL), deleteStroryCrtrl)

module.exports = router;
