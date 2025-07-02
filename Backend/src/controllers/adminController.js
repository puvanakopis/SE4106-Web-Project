const User = require('../models/User');
const Room = require('../models/Room');
const Transport = require('../models/Transport');
const Booking = require('../models/Booking');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [userCount, roomCount, transportCount, bookingCount] = await Promise.all([
      User.countDocuments(),
      Room.countDocuments(),
      Transport.countDocuments(),
      Booking.countDocuments()
    ]);

    res.json({
      userCount,
      roomCount,
      transportCount,
      bookingCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
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

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's rooms and transports
    await Room.deleteMany({ owner: req.params.id });
    await Transport.deleteMany({ owner: req.params.id });

    // Delete user's bookings
    await Booking.deleteMany({ user: req.params.id });

    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Room management
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('owner', 'firstName lastName')
      .sort('-createdAt');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('owner', 'firstName lastName')
      .populate('ratings.user', 'firstName lastName');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Delete related bookings
    await Booking.deleteMany({ item: req.params.id, itemType: 'Room' });

    await room.remove();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Transport management
exports.getAllTransports = async (req, res) => {
  try {
    const transports = await Transport.find()
      .populate('owner', 'firstName lastName')
      .sort('-createdAt');
    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTransport = async (req, res) => {
  try {
    const transport = new Transport(req.body);
    await transport.save();
    res.status(201).json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransportById = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id)
      .populate('owner', 'firstName lastName')
      .populate('ratings.user', 'firstName lastName');
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransport = async (req, res) => {
  try {
    const transport = await Transport.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    // Delete related bookings
    await Booking.deleteMany({ item: req.params.id, itemType: 'Transport' });

    await transport.remove();
    res.json({ message: 'Transport deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Booking management
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('item', 'title price')
      .populate('user', 'firstName lastName')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('item', 'title price')
      .populate('user', 'firstName lastName');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
