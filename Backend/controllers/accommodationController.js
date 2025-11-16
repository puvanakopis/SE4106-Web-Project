const Accommodation = require("../models/accommodationModel");
const Owner = require("../models/ownerModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Utility functions
const handleFileError = (files, res, message) => {
  if (files && files.length > 0) {
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }
  return res.status(400).json({ success: false, message });
};

const processAmenities = (amenities) => {
  if (typeof amenities === 'string') {
    try {
      return JSON.parse(amenities);
    } catch (e) {
      return amenities.split(',').map(a => a.trim());
    }
  }
  return amenities;
};

const processLocation = (location) => {
  if (typeof location === 'string') {
    try {
      return JSON.parse(location);
    } catch (e) {
      return null;
    }
  }
  return location;
};

const renameUploadedFiles = async (files, accommodationId, existingCount = 0) => {
  const renamedFiles = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imageNumber = existingCount + i + 1;
    const newFilename = `${accommodationId}_${imageNumber}${path.extname(file.originalname)}`;
    const newPath = path.join(path.dirname(file.path), newFilename);

    try {
      fs.renameSync(file.path, newPath);
      renamedFiles.push(`/uploads/accommodations/${newFilename}`);
    } catch (renameErr) {
      console.error('Error renaming file:', renameErr);
      renamedFiles.push(`/uploads/accommodations/${path.basename(file.path)}`);
    }
  }

  return renamedFiles;
};

const cleanupFiles = (files) => {
  if (files && files.length > 0) {
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }
};

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/accommodations');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const accommodationId = req.params.id || 'temp';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, accommodationId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadAccommodationImages = upload.array('images', 10);

// Controller functions
const createAccommodation = async (req, res) => {
  try {
    uploadAccommodationImages(req, res, async function (err) {
      if (err) return handleFileError(req.files, res, err.message);

      // Validate owner exists
      const owner = await Owner.findById(req.body.owner_id);
      if (!owner) return handleFileError(req.files, res, "Owner not found");

      // Process location data
      let locationData = null;
      if (req.body.location) {
        locationData = processLocation(req.body.location);
        if (!locationData || !locationData.coordinates) {
          return handleFileError(req.files, res, "Invalid location data. Coordinates are required.");
        }
      }

      // Prepare accommodation data
      const accommodationData = {
        ...req.body,
        amenities: processAmenities(req.body.amenities),
        noOfBed: parseInt(req.body.noOfBed),
        pricePerMonth: parseFloat(req.body.pricePerMonth),
        SecurityDeposit: parseFloat(req.body.SecurityDeposit)
      };

      // Add location data if provided
      if (locationData) {
        accommodationData.location = locationData;
      }

      // Handle uploaded images
      if (req.files?.length > 0) {
        accommodationData.images = req.files.map(file =>
          `/uploads/accommodations/${path.basename(file.path)}`
        );
      }

      // Create accommodation
      const accommodation = new Accommodation(accommodationData);
      await accommodation.save();

      // Rename files with proper accommodation ID
      if (req.files?.length > 0) {
        accommodation.images = await renameUploadedFiles(req.files, accommodation._id);
        await accommodation.save();
      }

      // Populate owner data
      await accommodation.populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews');

      res.status(201).json({ 
        success: true, 
        message: "Accommodation created successfully",
        accommodation 
      });
    });
  } catch (error) {
    console.error("Create accommodation error:", error);
    cleanupFiles(req.files);

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Accommodation with these details already exists" });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAccommodations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      accommodationType,
      min_price,
      max_price,
      search,
      isAvailable,
      noOfBed,
      status,
      sort_by = 'createdDate',
      sort_order = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (accommodationType) filter.accommodationType = accommodationType;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
    if (noOfBed) filter.noOfBed = parseInt(noOfBed);
    if (status) filter.status = status;

    // Price filter
    if (min_price || max_price) {
      filter.pricePerMonth = {};
      if (min_price) filter.pricePerMonth.$gte = parseFloat(min_price);
      if (max_price) filter.pricePerMonth.$lte = parseFloat(max_price);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { accommodationName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Default status filter to Active if not specified
    if (!status) {
      filter.status = "Active";
    }

    // Sort configuration
    const sortConfig = { [sort_by]: sort_order === 'desc' ? -1 : 1 };

    // Execute query with pagination
    const [accommodations, total] = await Promise.all([
      Accommodation.find(filter)
        .populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews')
        .sort(sortConfig)
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Accommodation.countDocuments(filter)
    ]);

    res.json({
      success: true,
      accommodations,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error("Get accommodations error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id)
      .populate('owner_id', 'fullName displayName profile_pic phoneNumber email address averageRating totalReviews ratingCount');

    if (!accommodation) {
      return res.status(404).json({ success: false, message: "Accommodation not found" });
    }

    res.json({ success: true, accommodation });
  } catch (error) {
    console.error("Get accommodation error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: "Invalid accommodation ID" });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAccommodation = async (req, res) => {
  try {
    uploadAccommodationImages(req, res, async function (err) {
      if (err) return handleFileError(req.files, res, err.message);

      // Check if accommodation exists
      const existingAccommodation = await Accommodation.findById(req.params.id);
      if (!existingAccommodation) {
        return handleFileError(req.files, res, "Accommodation not found");
      }

      // Prepare update data
      const updateData = {
        ...req.body,
        amenities: processAmenities(req.body.amenities)
      };

      // Process location if provided
      if (req.body.location) {
        const locationData = processLocation(req.body.location);
        if (locationData && locationData.coordinates) {
          updateData.location = locationData;
        }
      }

      // Parse numeric fields if they exist
      if (req.body.noOfBed) updateData.noOfBed = parseInt(req.body.noOfBed);
      if (req.body.pricePerMonth) updateData.pricePerMonth = parseFloat(req.body.pricePerMonth);
      if (req.body.SecurityDeposit) updateData.SecurityDeposit = parseFloat(req.body.SecurityDeposit);

      // Handle image uploads
      if (req.files?.length > 0) {
        const existingImagesCount = existingAccommodation.images.length;
        const newImages = await renameUploadedFiles(req.files, req.params.id, existingImagesCount);

        if (updateData.replaceImages === 'true') {
          // Delete existing images
          if (existingAccommodation.images?.length > 0) {
            existingAccommodation.images.forEach(imagePath => {
              const fullPath = path.join(__dirname, '..', imagePath);
              if (fs.existsSync(fullPath)) {
                try {
                  fs.unlinkSync(fullPath);
                } catch (unlinkErr) {
                  console.error('Error deleting old image:', unlinkErr);
                }
              }
            });
          }
          updateData.images = newImages;
        } else {
          updateData.images = [...existingAccommodation.images, ...newImages];
        }
      }

      // Update accommodation
      const accommodation = await Accommodation.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews');

      res.json({ 
        success: true, 
        message: "Accommodation updated successfully",
        accommodation 
      });
    });
  } catch (error) {
    console.error("Update accommodation error:", error);
    cleanupFiles(req.files);

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Accommodation with these details already exists" });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: "Invalid accommodation ID" });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ success: false, message: "Accommodation not found" });
    }

    // Delete associated images
    if (accommodation.images?.length > 0) {
      accommodation.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (unlinkErr) {
            console.error('Error deleting image:', unlinkErr);
          }
        }
      });

      // Clean up any remaining files with the accommodation ID
      const uploadDir = path.join(__dirname, '../uploads/accommodations');
      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        files.forEach(file => {
          if (file.startsWith(req.params.id + '_')) {
            try {
              fs.unlinkSync(path.join(uploadDir, file));
            } catch (cleanupErr) {
              console.error('Error cleaning up accommodation files:', cleanupErr);
            }
          }
        });
      }
    }

    await Accommodation.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: "Accommodation deleted successfully" 
    });
  } catch (error) {
    console.error("Delete accommodation error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: "Invalid accommodation ID" });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAccommodationAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ success: false, message: "isAvailable must be a boolean value" });
    }

    const accommodation = await Accommodation.findByIdAndUpdate(
      id,
      { isAvailable, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    ).populate('owner_id', 'fullName displayName profile_pic phoneNumber email');

    if (!accommodation) {
      return res.status(404).json({ success: false, message: "Accommodation not found" });
    }

    res.json({
      success: true,
      message: `Accommodation ${isAvailable ? 'marked as available' : 'marked as unavailable'}`,
      accommodation
    });
  } catch (error) {
    console.error("Update accommodation availability error:", error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: "Invalid accommodation ID" });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAccommodationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Active", "Blocked"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be one of: Active, Blocked" });
    }

    const accommodation = await Accommodation.findByIdAndUpdate(
      id,
      { status, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    ).populate('owner_id', 'fullName displayName profile_pic phoneNumber email');

    if (!accommodation) {
      return res.status(404).json({ success: false, message: "Accommodation not found" });
    }

    res.json({
      success: true,
      message: `Accommodation status updated to ${status}`,
      accommodation
    });
  } catch (error) {
    console.error("Update accommodation status error:", error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: "Invalid accommodation ID" });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

const toggleAccommodationAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      return res.status(404).json({ success: false, message: "Accommodation not found" });
    }

    accommodation.isAvailable = !accommodation.isAvailable;
    accommodation.lastUpdated = Date.now();
    await accommodation.save();

    await accommodation.populate('owner_id', 'fullName displayName profile_pic phoneNumber email');

    res.json({
      success: true,
      message: `Accommodation ${accommodation.isAvailable ? 'marked as available' : 'marked as unavailable'}`,
      accommodation
    });
  } catch (error) {
    console.error("Toggle accommodation availability error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: "Invalid accommodation ID" });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get accommodations by owner
const getAccommodationsByOwner = async (req, res) => {
  try {
    const { owner_id } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Validate owner exists
    const owner = await Owner.findById(owner_id);
    if (!owner) {
      return res.status(404).json({ success: false, message: "Owner not found" });
    }

    // Build filter
    const filter = { owner_id };
    if (status) filter.status = status;

    const [accommodations, total] = await Promise.all([
      Accommodation.find(filter)
        .populate('owner_id', 'fullName displayName profile_pic phoneNumber email')
        .sort({ createdDate: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Accommodation.countDocuments(filter)
    ]);

    res.json({
      success: true,
      accommodations,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error("Get accommodations by owner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Search accommodations with advanced filters
const searchAccommodations = async (req, res) => {
  try {
    const {
      search,
      accommodationType,
      min_price,
      max_price,
      min_beds,
      max_beds,
      location,
      amenities,
      page = 1,
      limit = 10,
      sort_by = 'createdDate',
      sort_order = 'desc'
    } = req.query;

    // Build filter
    const filter = { status: "Active" }; // Only show active accommodations

    // Search text
    if (search) {
      filter.$or = [
        { accommodationName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Accommodation type
    if (accommodationType) {
      filter.accommodationType = accommodationType;
    }

    // Price range
    if (min_price || max_price) {
      filter.pricePerMonth = {};
      if (min_price) filter.pricePerMonth.$gte = parseFloat(min_price);
      if (max_price) filter.pricePerMonth.$lte = parseFloat(max_price);
    }

    // Bed range
    if (min_beds || max_beds) {
      filter.noOfBed = {};
      if (min_beds) filter.noOfBed.$gte = parseInt(min_beds);
      if (max_beds) filter.noOfBed.$lte = parseInt(max_beds);
    }

    // Location search
    if (location) {
      filter.$or = filter.$or || [];
      filter.$or.push(
        { address: { $regex: location, $options: 'i' } },
        { 'location.title': { $regex: location, $options: 'i' } }
      );
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      filter.amenities = { $in: amenitiesArray.map(a => new RegExp(a, 'i')) };
    }

    // Sort configuration
    const sortConfig = { [sort_by]: sort_order === 'desc' ? -1 : 1 };

    // Execute query
    const [accommodations, total] = await Promise.all([
      Accommodation.find(filter)
        .populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews')
        .sort(sortConfig)
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Accommodation.countDocuments(filter)
    ]);

    res.json({
      success: true,
      accommodations,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      filters: {
        search,
        accommodationType,
        min_price: min_price ? parseFloat(min_price) : null,
        max_price: max_price ? parseFloat(max_price) : null,
        min_beds: min_beds ? parseInt(min_beds) : null,
        max_beds: max_beds ? parseInt(max_beds) : null,
        location
      }
    });
  } catch (error) {
    console.error("Search accommodations error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodation,
  updateAccommodation,
  deleteAccommodation,
  updateAccommodationAvailability,
  updateAccommodationStatus,
  toggleAccommodationAvailability,
  getAccommodationsByOwner,
  searchAccommodations
};