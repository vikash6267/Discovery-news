const { auth, requireRole, ROLES } = require("../middleware/auth");
const express = require('express');
const router = express.Router();
const adminAccess = require('../controllers/adminAccess');


// Add a new admin
router.post('/add', auth, requireRole(...ROLES.MASTER), adminAccess.addAdmin);
router.get('/', auth, requireRole(...ROLES.MANAGE), adminAccess.allAdmin);

// Update admin permissions
router.put('/update/:adminId', auth, requireRole(...ROLES.MASTER), adminAccess.updateAdminPermissions);

// Delete an admin
router.delete('/delete/:adminId', auth, requireRole(...ROLES.MASTER), adminAccess.deleteAdmin);

module.exports = router;
