const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize app
const app = express();

// Connect to database
connectDB();

// Create default admin if not exists
const createDefaultAdmin = async () => {
  const Admin = require('./models/Admin');
  const Counter = require('./models/Counter');
  
  try {
    const adminExists = await Admin.findOne({ email: 'admin@campusease.com' });
    
    if (!adminExists) {
      // Ensure the admin counter exists
      await Counter.findByIdAndUpdate(
        { _id: 'adminId' },
        { $setOnInsert: { value: 0 } },
        { upsert: true }
      );

      const admin = new Admin({
        email: 'admin@campusease.com',
        password: 'Admin@123', 
        name: 'System Admin'
      });

      await admin.save();
      console.log(`Default admin created with ID: ${admin._id}`);
    }

    // Initialize user counter if it doesn't exist
    await Counter.findByIdAndUpdate(
      { _id: 'userId' },
      { $setOnInsert: { value: 0 } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error setting up default admin:', error);
  }
};

// Execute admin creation and counter initialization
createDefaultAdmin().catch(err => {
  console.error('Failed to initialize default admin:', err);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes.js'));

// Add this after your other route imports
const ownerRoutes = require('./routes/ownerRoutes.js');

// Add this to your middleware section, after other app.use() calls
app.use('/api/owners', ownerRoutes);

// Make sure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle file upload errors specifically
  if (err.message === 'File too large') {
    return res.status(413).json({ error: 'File size exceeds 1MB limit' });
  }
  
  if (err.message === 'Images only!') {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }

  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});