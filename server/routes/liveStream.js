const { auth, requireRole, ROLES } = require("../middleware/auth");
const express = require('express');
const router = express.Router();
const {
  createLiveStream,
  getAllLiveStreams,
  deleteLiveStream,
  updateLiveStreamStatus,
  updateLiveStream,
} = require('../controllers/liveStreaming');

// Create a new live stream
router.post('/create', auth, requireRole(...ROLES.MANAGE), createLiveStream);

router.put('/livestream/:id', auth, requireRole(...ROLES.MANAGE), updateLiveStream);
// Get all live streams
router.get('/getAll', getAllLiveStreams);

// Delete a live stream by ID
router.delete('/delete/:id', auth, requireRole(...ROLES.MANAGE), deleteLiveStream);

// Update live stream status by ID
router.put('/update/:id', auth, requireRole(...ROLES.MANAGE), updateLiveStreamStatus);

module.exports = router;
