const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');

// User registration route
router.post('/register', upload, authController.register);

// User login route
router.post('/login', authController.login);

// Admin login route
router.post('/admin/login', authController.loginAdmin);

// Get profile route (works for both users and admins)
router.get('/profile', auth, authController.getProfile);

module.exports = router;