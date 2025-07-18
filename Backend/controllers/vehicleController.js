const Vehicle = require('../models/vehicleModel');

// @desc    Get all vehicles
// @route   GET /api/v1/vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles)
    alert("vehiles")
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api//vehicles/:id
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ vehicle_id: req.params.id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
