const User = require('../models/User');
const Room = require('../models/Room');
const Transport = require('../models/Transport');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('bookings', 'item itemType startDate endDate status');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('item', 'title price')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get specific booking
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('item', 'title price');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Saved items management
exports.getSavedItems = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('savedRooms savedTransports')
      .populate('savedRooms', 'title price')
      .populate('savedTransports', 'make model pricePerDay');
    
    res.json({
      savedRooms: user.savedRooms || [],
      savedTransports: user.savedTransports || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveItem = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (itemType === 'room') {
      user.savedRooms = [...(user.savedRooms || []), itemId];
    } else if (itemType === 'transport') {
      user.savedTransports = [...(user.savedTransports || []), itemId];
    }

    await user.save();
    res.json({ message: 'Item saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeSavedItem = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (itemType === 'room') {
      user.savedRooms = user.savedRooms.filter(id => id.toString() !== itemId);
    } else if (itemType === 'transport') {
      user.savedTransports = user.savedTransports.filter(id => id.toString() !== itemId);
    }

    await user.save();
    res.json({ message: 'Item removed from saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User's rooms and transports
exports.getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user.id })
      .populate('ratings.user', 'firstName lastName');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTransports = async (req, res) => {
  try {
    const transports = await Transport.find({ owner: req.user.id })
      .populate('ratings.user', 'firstName lastName');
    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyRoomById = async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      owner: req.user.id
    }).populate('ratings.user', 'firstName lastName');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTransportById = async (req, res) => {
  try {
    const transport = await Transport.findOne({
      _id: req.params.id,
      owner: req.user.id
    }).populate('ratings.user', 'firstName lastName');

    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
