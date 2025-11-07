const express = require('express');
const multer = require('multer');
const path = require('path');
const { register, login, logout, getMe, updateProfile, changePassword, deleteAccount, registerValidation, loginValidation, updateProfileValidation, changePasswordValidation } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

router.post('/register', upload.single('photo'), registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('photo'), updateProfileValidation, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);
router.delete('/delete-account', protect, deleteAccount);
router.post('/logout', protect, logout);

module.exports = router;