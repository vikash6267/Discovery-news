const { auth, requireRole, ROLES } = require("../middleware/auth");
// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    toggleActive,
    deleteCategory
} = require('../controllers/category');

// Categories routes
router.post('/create', auth, requireRole(...ROLES.MANAGE), createCategory); // Create a new category
router.delete('/delete/:id', auth, requireRole(...ROLES.MANAGE), deleteCategory); // Create a new category
router.get('/all', getAllCategories); // Get all categories with populated subCategories
router.get('/:id', getCategoryById); // Get a single category by ID with populated subCategories
router.put('/toggleActive', auth, requireRole(...ROLES.MANAGE), toggleActive); // Toggle active status of category

module.exports = router;
