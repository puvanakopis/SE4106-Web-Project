const Room = require('../models/Room');
const { protect, admin } = require('../middleware/auth');

// Get all rooms
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

// Get room by ID
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

// Create new room (admin only)
exports.createRoom = async (req, res) => {
  try {
    const room = new Room({
      ...req.body,
      owner: req.user.id
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update room (admin only)
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete room (admin only)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await room.remove();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search rooms
exports.searchRooms = async (req, res) => {
  try {
    const { location, priceRange, facilities } = req.query;
    const query = {};

    if (location) {
      const coordinates = location.split(',').map(Number);
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: 10000 // 10km radius
        }
      };
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      query.price = { $gte: min, $lte: max };
    }

    if (facilities) {
      query.facilities = { $all: facilities.split(',') };
    }

    const rooms = await Room.find(query)
      .populate('owner', 'firstName lastName')
      .sort('-createdAt');

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
