// routesRoutes.js
const express = require('express');
const { createStoryCtrl, getAllStoryCtrl, getSingleStoryCtrl, deleteStroryCrtrl } = require('../controllers/storiesCtrl');
const router = express.Router();

router.post("/create", createStoryCtrl)
router.get("/getAll", getAllStoryCtrl)
router.get("/get/:id", getSingleStoryCtrl)
router.delete("/delete/:id", deleteStroryCrtrl)

module.exports = router;
