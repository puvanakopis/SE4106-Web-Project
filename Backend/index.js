const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
require('dotenv').config();

// Initialize app
const app = express();

// Connect to database
connectDB();

// Create default admin if not exists
const createDefaultAdmin = async () => {
  const Admin = require('./models/Admin');
  const adminExists = await Admin.findOne({ email: 'admin@campusease.com' });
  
  if (!adminExists) {
    const admin = new Admin({
      email: 'admin@campusease.com',
      password: 'Admin@123', 
      name: 'System Admin'
    });
    await admin.save();
    console.log('Default admin created');
  }
};

createDefaultAdmin();



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));