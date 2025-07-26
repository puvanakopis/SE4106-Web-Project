const express = require('express');
const router = express.Router();
const vehicle = require('../controllers/vehicleController');

// Route to get all vehicles
router.get('/', vehicle.getAllVehicles);

// Route to get a specific vehicle by ID
router.get('/:id', vehicle.getVehicleById); // <- Fixed route

module.exports = router;
