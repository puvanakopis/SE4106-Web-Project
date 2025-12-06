const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoute = require('./routes/authRoute');
const ownerRoutes = require('./routes/ownerRoutes');
const transportRoutes = require('./routes/transportRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes');
const transportBookingRoutes = require('./routes/transportBookingRoutes');
const accommodationBookingRoutes = require('./routes/accommodationBookingRoutes');

const seedAdmin = require('./utils/seedAdmin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/owners', ownerRoutes);
app.use('/api/transports', transportRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/transport-bookings', transportBookingRoutes);
app.use('/api/accommodation-bookings', accommodationBookingRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedAdmin();
  })
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});