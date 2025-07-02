const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/profile', userController.updateProfile);
router.post('/password', userController.changePassword);

// Protected routes
router.use(protect);

// User routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.changePassword);
router.get('/bookings', userController.getUserBookings);
router.get('/bookings/:id', userController.getBookingById);
router.get('/saved-items', userController.getSavedItems);
router.post('/saved-items', userController.saveItem);
router.delete('/saved-items/:id', userController.removeSavedItem);

// User's rooms and transports
router.get('/my-rooms', userController.getMyRooms);
router.get('/my-transports', userController.getMyTransports);
router.get('/my-rooms/:id', userController.getMyRoomById);
router.get('/my-transports/:id', userController.getMyTransportById);

module.exports = router;
