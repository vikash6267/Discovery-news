// routesRoutes.js
const express = require('express');
const { createStoryCtrl, getAllStoryCtrl } = require('../controllers/storiesCtrl');
const router = express.Router();

router.post("/create", createStoryCtrl)
router.get("/getAll", getAllStoryCtrl)

module.exports = router;
