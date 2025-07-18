const express = require('express');
const router = express.Router();
const vehicle = require('../controllers/vehicleController');

router.get('/', vehicle.getAllVehicles);
router.get('/:id', vehicle.getVehicleById);

module.exports = router;
