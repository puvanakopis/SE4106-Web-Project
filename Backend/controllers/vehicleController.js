const Vehicle = require('../models/vehicleModel');

// @desc    Get all vehicles
// @route   GET /api/v1/vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles); // ✅ First response
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' }); // ❌ Will throw if error happens after response is already sent
  }
};


// @desc    Get single vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params; // id is 'V001' or similar custom vehicle_id

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vehicle ID is required' 
      });
    }

    // Find vehicle by custom vehicle_id field instead of MongoDB _id
    const vehicle = await Vehicle.findOne({ vehicle_id: id });

    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vehicle not found' 
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


