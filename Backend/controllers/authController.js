// Below is a complete working example that correctly saves profile photos
// into uploads/user/ with proper file renaming and path storage.

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const path = require('path');
const fs = require('fs');

// Generate JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// Extract file extension
const getFileExtension = (filename) => filename.split('.').pop();

/* ===================== VALIDATION RULES ===================== */

const registerValidation = [
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

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('displayName')
    .optional()
    .isLength({ max: 50 }).withMessage('Display name cannot be more than 50 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isLength({ max: 20 }).withMessage('Phone number cannot be more than 20 characters'),
  body('address')
    .optional()
    .isLength({ max: 200 }).withMessage('Address cannot be more than 200 characters')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];


const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists with this email' });

    let user = await User.create({ fullName, email, password, role });

    if (req.file) {
      const fileExtension = getFileExtension(req.file.filename);
      const newFilename = `${user._id}.${fileExtension}`;

      const newFilePath = path.join('uploads/user', newFilename);
      const uploadDir = path.join(__dirname, '..', 'uploads/user');

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      fs.renameSync(req.file.path, path.join(__dirname, '..', newFilePath));

      user.photo = `uploads/user/${newFilename}`;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        displayName: user.displayName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        photo: user.photo
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};



const login = async (req, res) => {
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
      user: {
        id: user._id,
        fullName: user.fullName,
        displayName: user.displayName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        photo: user.photo
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};



const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        displayName: user.displayName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        photo: user.photo
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { fullName, displayName, email, phone, address } = req.body;
    const updateData = { fullName, displayName, email, phone, address };

    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ success: false, message: 'Email is already taken' });
    }

    if (req.file) {
      const user = await User.findById(req.user.id);

      if (user.photo) {
        const oldPhoto = path.join(__dirname, '..', user.photo);
        if (fs.existsSync(oldPhoto)) fs.unlinkSync(oldPhoto);
      }

      const fileExtension = getFileExtension(req.file.filename);
      const newFilename = `${user._id}.${fileExtension}`;
      const newFilePath = path.join('uploads/user', newFilename);

      fs.renameSync(req.file.path, path.join(__dirname, '..', newFilePath));
      updateData.photo = `uploads/user/${newFilename}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });

    res.json({ success: true, user });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error during profile update' });
  }
};


const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(password)))
      return res.status(400).json({ success: false, message: 'Password is incorrect' });

    if (user.photo) {
      const photoPath = path.join(__dirname, '..', user.photo);
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }

    user.isActive = false;
    await user.save();

    res.json({ success: true, message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, message: 'Server error during account deletion' });
  }
};


const logout = async (req, res) => {
  try {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};


const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password change' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
};
