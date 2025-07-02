const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    required: true,
    enum: ['car', 'bus', 'van', 'bike']
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  facilities: [{
    type: String,
    required: true
  }],
  location: {
    address: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    review: String
  }],
  availability: [{
    startDate: Date,
    endDate: Date
  }],
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

transportSchema.index({ 'location.coordinates': '2dsphere' });

const Transport = mongoose.model('Transport', transportSchema);
module.exports = Transport;
