const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all admins (accessible to superusers)
router.get('/admins', authMiddleware.authenticateUser, authMiddleware.authorizeRoles('superuser'), adminController.getAllAdmins);

// Add a new admin (accessible to superusers)
router.post('/admins', authMiddleware.authenticateUser, authMiddleware.authorizeRoles('superuser'), adminController.addAdmin);

// Add a new superuser (accessible to superusers)
router.post('/superusers', authMiddleware.authenticateUser, authMiddleware.authorizeRoles('superuser'), adminController.addSuperuser);

module.exports = router;
