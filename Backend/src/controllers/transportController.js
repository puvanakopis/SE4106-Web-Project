const Transport = require('../models/Transport');
const { protect, admin } = require('../middleware/auth');

// Get all transports
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

// Get transport by ID
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

// Create new transport (admin only)
exports.createTransport = async (req, res) => {
  try {
    const transport = new Transport({
      ...req.body,
      owner: req.user.id
    });

    await transport.save();
    res.status(201).json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update transport (admin only)
exports.updateTransport = async (req, res) => {
  try {
    let transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    transport = await Transport.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete transport (admin only)
exports.deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    await transport.remove();
    res.json({ message: 'Transport deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search transports
exports.searchTransports = async (req, res) => {
  try {
    const { location, priceRange, vehicleType } = req.query;
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
      query.pricePerDay = { $gte: min, $lte: max };
    }

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    const transports = await Transport.find(query)
      .populate('owner', 'firstName lastName')
      .sort('-createdAt');

    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
