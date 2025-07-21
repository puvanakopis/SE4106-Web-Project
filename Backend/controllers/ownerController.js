const Owner = require('../models/Owner');
const fs = require('fs');
const path = require('path');

// Helper function to handle file uploads
const handleFileUpload = (file, folder) => {
  if (!file) return null;
  
  const uploadDir = path.join(__dirname, '../uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, file.buffer);
  
  return `/uploads/${folder}/${filename}`;
};

// Create a new owner
exports.createOwner = async (req, res) => {
  try {
    const { fullName, email, phone, address, bankDetails } = req.body;
    
    // Handle file uploads
    const profilePicPath = req.files?.profilePic 
      ? handleFileUpload(req.files.profilePic[0], 'profile-pics') 
      : null;
    const governmentIdPath = req.files?.governmentId 
      ? handleFileUpload(req.files.governmentId[0], 'government-ids') 
      : null;

    // Create new owner
    const owner = new Owner({
      fullName,
      email,
      phone,
      address,
      profilePic: profilePicPath || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`,
      governmentId: governmentIdPath,
      bankDetails: JSON.parse(bankDetails || '{}')
    });

    await owner.save();

    res.status(201).json({
      success: true,
      data: owner
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all owners
exports.getAllOwners = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search } }
        ]
      };
    }

    const owners = await Owner.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: owners.length,
      data: owners
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get owner by ID
exports.getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.json({
      success: true,
      data: owner
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update owner
exports.updateOwner = async (req, res) => {
  try {
    const { fullName, email, phone, address, bankDetails, isBlocked } = req.body;
    const owner = await Owner.findById(req.params.id);
    
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Handle file uploads
    const profilePicPath = req.files?.profilePic 
      ? handleFileUpload(req.files.profilePic[0], 'profile-pics') 
      : owner.profilePic;
    const governmentIdPath = req.files?.governmentId 
      ? handleFileUpload(req.files.governmentId[0], 'government-ids') 
      : owner.governmentId;

    owner.fullName = fullName || owner.fullName;
    owner.email = email || owner.email;
    owner.phone = phone || owner.phone;
    owner.address = address || owner.address;
    owner.profilePic = profilePicPath;
    owner.governmentId = governmentIdPath;
    owner.bankDetails = bankDetails ? JSON.parse(bankDetails) : owner.bankDetails;
    owner.isBlocked = isBlocked !== undefined ? isBlocked : owner.isBlocked;
    owner.updatedAt = Date.now();

    await owner.save();

    res.json({
      success: true,
      data: owner
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete owner
exports.deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndDelete(req.params.id);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get owner statistics
exports.getOwnerStats = async (req, res) => {
  try {
    const totalOwners = await Owner.countDocuments();
    const activeOwners = await Owner.countDocuments({ isBlocked: false });
    const blockedOwners = totalOwners - activeOwners;

    res.json({
      success: true,
      data: {
        totalOwners,
        activeOwners,
        blockedOwners,
        ownersWithProperties: 0 // You can update this when you implement properties
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};