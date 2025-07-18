const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicle_id: String,
  brand: String,
  model: String,
  vehicle_type: String,
  fuel_type: String,
  seating_capacity: Number,
  rental_price_per_day: Number,
  average_rating: Number,
  vehicle_images: [String]
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
