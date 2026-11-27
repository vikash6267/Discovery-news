// routesRoutes.js
const express = require('express');
const router = express.Router();
const {
  createNews,
  updateNewsById,
  toggleActive,
  getAllNews,
  deleteNewsById,
  getNewsById,
  getAllNotifications,
  likePost,
  commentOnPost,
  removelikePost,
} = require('../controllers/news');

const { auth, isUser, isAdmin, requireRole, ROLES } = require("../middleware/auth");


router.post('/create', auth, requireRole(...ROLES.STAFF), createNews);

router.put('/update', auth, requireRole(...ROLES.STAFF), updateNewsById);

router.put('/toggleActive', auth, requireRole(...ROLES.EDITORIAL), toggleActive);

router.get('/all', getAllNews);

router.delete('/delete', auth, requireRole(...ROLES.EDITORIAL), deleteNewsById);

router.get('/:newsId', getNewsById);



router.post('/notifications', getAllNotifications);



router.post("/like", auth, likePost);
router.post("/removelike", auth, removelikePost);

// Comment on a community post - accessible by authenticated users
router.post("/comment", auth, commentOnPost);


module.exports = router;
