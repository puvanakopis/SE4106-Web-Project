const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController.js');
const { uploadMultipleFiles } = require('../middlewares/upload.js');
const auth = require('../middlewares/auth.js');

// Create a new owner
router.post(
  '/', 
  auth.adminAuth,
  uploadMultipleFiles,
  ownerController.createOwner
);

// Get all owners
router.get('/', auth.adminAuth, ownerController.getAllOwners);

// Get owner by ID
router.get('/:id', auth.adminAuth, ownerController.getOwnerById);

// Update owner
router.put(
  '/:id', 
  auth.adminAuth,
  uploadMultipleFiles,
  ownerController.updateOwner
);

// Delete owner
router.delete('/:id', auth.adminAuth, ownerController.deleteOwner);

// Get owner statistics
router.get('/stats/all', auth.adminAuth, ownerController.getOwnerStats);

module.exports = router;