const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const path = require('path');
const fs = require('fs');

// Validations
exports.registerValidation = [
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['student', 'lecturer']).withMessage('Role must be student or lecturer')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// JWT Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// Register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists with this email' });

    let photoPath = null;
    if (req.file) photoPath = `uploads/${req.file.filename}`;

    const user = await User.create({ fullName, email, password, role, photo: photoPath });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, dp: user.photo }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.isActive)
      return res.status(401).json({ success: false, message: 'Account has been deactivated' });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, dp: user.photo }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, dp: user.photo } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const updateData = { fullName, email };

    if (req.file) {
      if (req.user.photo) {
        const oldPhotoPath = path.join(__dirname, '..', req.user.photo);
        if (fs.existsSync(oldPhotoPath)) fs.unlinkSync(oldPhotoPath);
      }
      updateData.photo = `uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });

    res.json({
      success: true,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, dp: user.photo }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error during profile update' });
  }
};
