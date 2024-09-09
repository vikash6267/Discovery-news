// routesRoutes.js
const express = require('express');
const { createStoryCtrl, getAllStoryCtrl,getSingleStoryCtrl } = require('../controllers/storiesCtrl');
const router = express.Router();

router.post("/create", createStoryCtrl)
router.get("/getAll", getAllStoryCtrl)
router.get("/get/:id", getSingleStoryCtrl)

module.exports = router;
