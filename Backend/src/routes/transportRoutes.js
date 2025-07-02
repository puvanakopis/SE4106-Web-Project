const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', transportController.getAllTransports);
router.get('/:id', transportController.getTransportById);
router.get('/search', transportController.searchTransports);

// Protected routes
router.use(protect);
router.post('/', admin, transportController.createTransport);
router.put('/:id', admin, transportController.updateTransport);
router.delete('/:id', admin, transportController.deleteTransport);

module.exports = router;
