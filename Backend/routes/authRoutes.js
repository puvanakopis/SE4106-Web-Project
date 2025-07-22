const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const upload = require('../middlewares/upload.js');
const auth = require('../middlewares/auth.js');

// User registration route
router.post('/register', upload.uploadOwnerFiles, authController.register);

// User login route
router.post('/login', authController.login);

// Admin login route
router.post('/admin/login', authController.loginAdmin);

// Get profile route (works for both users and admins)
router.get('/profile', auth, authController.getProfile);

module.exports = router;