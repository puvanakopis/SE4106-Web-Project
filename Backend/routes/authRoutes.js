const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');

// Register route
router.post('/register', upload, authController.register);

// Get user profile (protected route)
router.get('/profile', auth, authController.getProfile);

module.exports = router;