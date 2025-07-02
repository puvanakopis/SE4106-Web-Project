const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// Protected routes
router.use(protect, admin);

// Admin routes
router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Room management
router.get('/rooms', adminController.getAllRooms);
router.post('/rooms', adminController.createRoom);
router.get('/rooms/:id', adminController.getRoomById);
router.put('/rooms/:id', adminController.updateRoom);
router.delete('/rooms/:id', adminController.deleteRoom);

// Transport management
router.get('/transports', adminController.getAllTransports);
router.post('/transports', adminController.createTransport);
router.get('/transports/:id', adminController.getTransportById);
router.put('/transports/:id', adminController.updateTransport);
router.delete('/transports/:id', adminController.deleteTransport);

// Booking management
router.get('/bookings', adminController.getAllBookings);
router.get('/bookings/:id', adminController.getBookingById);
router.put('/bookings/:id/status', adminController.updateBookingStatus);

module.exports = router;
