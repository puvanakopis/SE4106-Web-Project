const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.get('/search', roomController.searchRooms);

// Protected routes
router.use(protect);
router.post('/', admin, roomController.createRoom);
router.put('/:id', admin, roomController.updateRoom);
router.delete('/:id', admin, roomController.deleteRoom);

module.exports = router;
