const Accommodation = require("../models/accommodationModel");
const Owner = require("../models/ownerModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadAccommodationImages = upload.array('images', 10);

const createAccommodation = async (req, res) => {
  try {
    uploadAccommodationImages(req, res, async function (err) {
      if (err) return handleFileError(req.files, res, err.message);

      const owner = await Owner.findById(req.body.owner_id);
      if (!owner) return handleFileError(req.files, res, "Owner not found");

      let locationData = {};
      if (req.body.location) {
        try {
          locationData = typeof req.body.location === 'string'
            ? JSON.parse(req.body.location)
            : req.body.location;
        } catch (e) {
          console.error('Error parsing location data:', e);
        }
      }

      if (req.body.coordinates) {
        try {
          const coordinates = typeof req.body.coordinates === 'string'
            ? JSON.parse(req.body.coordinates)
            : req.body.coordinates;

          if (Array.isArray(coordinates) && coordinates.length === 2) {
            locationData.coordinates = coordinates;
          }
        } catch (e) {
          console.error('Error parsing coordinates:', e);
        }
      }

      const accommodationData = {
        ...req.body,
        amenities: processAmenities(req.body.amenities),
        ...(Object.keys(locationData).length > 0 && { location: locationData })
      };

      delete accommodationData.coordinates;
      delete accommodationData.replaceImages;

      if (req.files?.length > 0) {
        accommodationData.images = req.files.map(file =>
          `/uploads/accommodations/${path.basename(file.path)}`
        );
      }

      const accommodation = new Accommodation(accommodationData);
      await accommodation.save();

      if (req.files?.length > 0) {
        accommodation.images = await renameUploadedFiles(req.files, accommodation._id);
        await accommodation.save();
      }

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
      return res.status(400).json({
        success: false,
        message: "Accommodation with these details already exists"
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating accommodation"
    });
  }
};

const getAccommodations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      property_type,
      min_price,
      max_price,
      search,
      available,
      status,
      min_bedrooms,
      max_bedrooms,
      min_bathrooms,
      max_bathrooms,
      min_area,
      max_area,
      sort_by = 'createdDate',
      sort_order = 'desc',
      location_lat,
      location_lng,
      max_distance = 50000
    } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (property_type) filter.property_type = property_type;
    if (available) filter.available = available;
    if (status) filter.status = status;

    if (min_price || max_price) {
      filter.price_per_month = {};
      if (min_price) filter.price_per_month.$gte = parseInt(min_price);
      if (max_price) filter.price_per_month.$lte = parseInt(max_price);
    }

    if (min_bedrooms || max_bedrooms) {
      filter.bedrooms = {};
      if (min_bedrooms) filter.bedrooms.$gte = parseInt(min_bedrooms);
      if (max_bedrooms) filter.bedrooms.$lte = parseInt(max_bedrooms);
    }

    if (min_bathrooms || max_bathrooms) {
      filter.bathrooms = {};
      if (min_bathrooms) filter.bathrooms.$gte = parseInt(min_bathrooms);
      if (max_bathrooms) filter.bathrooms.$lte = parseInt(max_bathrooms);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location_lat && location_lng) {
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(location_lng), parseFloat(location_lat)]
          },
          $maxDistance: parseInt(max_distance)
        }
      };
    }

    const sortConfig = { [sort_by]: sort_order === 'desc' ? -1 : 1 };

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
      total
    });
  } catch (error) {
    console.error("Get accommodations error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching accommodations"
    });
  }
};

const getAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id)
      .populate('owner_id', 'fullName displayName profile_pic phoneNumber email address averageRating totalReviews ratingCount');

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found"
      });
    }

    res.json({
      success: true,
      accommodation
    });
  } catch (error) {
    console.error("Get accommodation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching accommodation"
    });
  }
};

const updateAccommodation = async (req, res) => {
  try {
    uploadAccommodationImages(req, res, async function (err) {
      if (err) return handleFileError(req.files, res, err.message);

      let locationData = {};
      if (req.body.location) {
        try {
          locationData = typeof req.body.location === 'string'
            ? JSON.parse(req.body.location)
            : req.body.location;
        } catch (e) {
          console.error('Error parsing location data:', e);
        }
      }

      const updateData = {
        ...req.body,
        amenities: processAmenities(req.body.amenities),
        ...(Object.keys(locationData).length > 0 && { location: locationData })
      };

      delete updateData.coordinates;
      delete updateData.replaceImages;

      if (req.files?.length > 0) {
        const existingAccommodation = await Accommodation.findById(req.params.id);
        const existingImagesCount = existingAccommodation ? existingAccommodation.images.length : 0;

        const newImages = await renameUploadedFiles(req.files, req.params.id, existingImagesCount);

        if (updateData.replaceImages === 'true') {
          if (existingAccommodation?.images) {
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
          updateData.images = [...(existingAccommodation?.images || []), ...newImages];
        }
      }

      const accommodation = await Accommodation.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews');

      if (!accommodation) return handleFileError(req.files, res, "Accommodation not found");

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
      return res.status(400).json({
        success: false,
        message: "Accommodation with these details already exists"
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating accommodation"
    });
  }
};

const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found"
      });
    }

    if (accommodation.images?.length > 0) {
      accommodation.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (unlinkErr) {
            console.error('Error deleting accommodation image:', unlinkErr);
          }
        }
      });

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
    res.status(500).json({
      success: false,
      message: "Server error while deleting accommodation"
    });
  }
};

const updateAccommodationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Active", "Blocked"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`
      });
    }

    const accommodation = await Accommodation.findByIdAndUpdate(
      id,
      { status, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    ).populate("owner_id", "fullName displayName profile_pic phoneNumber email");

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found"
      });
    }

    return res.json({
      success: true,
      message: `Accommodation status updated to ${status}`,
      accommodation
    });

  } catch (error) {
    console.error("Update accommodation status error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating accommodation status"
    });
  }
};


const getAccommodationsByOwner = async (req, res) => {
  try {
    const { owner_id } = req.params;

    if (!owner_id) {
      return res.status(400).json({
        success: false,
        message: "Owner ID is required"
      });
    }

    const owner = await Owner.findById(owner_id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found"
      });
    }

    const {
      page = 1,
      limit = 10,
      type,
      property_type,
      status,
      available,
      sort_by = 'createdDate',
      sort_order = 'desc'
    } = req.query;

    const filter = { owner_id };

    if (type) filter.type = type;
    if (property_type) filter.property_type = property_type;
    if (status) filter.status = status;
    if (available) filter.available = available;

    const sortConfig = { [sort_by]: sort_order === 'desc' ? -1 : 1 };

    const [accommodations, total] = await Promise.all([
      Accommodation.find(filter)
        .populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews')
        .sort(sortConfig)
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Accommodation.countDocuments(filter)
    ]);

    const stats = await Accommodation.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAccommodations: { $sum: 1 },
          availableAccommodations: {
            $sum: { $cond: [{ $eq: ["$available", "Available"] }, 1, 0] }
          },
          activeAccommodations: {
            $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
          },
          averageRating: { $avg: "$averageRating" },
          totalMonthlyRevenue: { $sum: "$price_per_month" },
          averageBedrooms: { $avg: "$bedrooms" },
          averageBathrooms: { $avg: "$bathrooms" }
        }
      }
    ]);

    const typeDistribution = await Accommodation.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    const propertyDistribution = await Accommodation.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$property_type",
          count: { $sum: 1 }
        }
      }
    ]);

    const statistics = stats[0] || {
      totalAccommodations: 0,
      availableAccommodations: 0,
      activeAccommodations: 0,
      averageRating: 0,
      totalMonthlyRevenue: 0,
      averageBedrooms: 0,
      averageBathrooms: 0
    };

    res.json({
      success: true,
      accommodations,
      statistics: {
        ...statistics,
        typeDistribution,
        propertyDistribution
      },
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        limit: parseInt(limit)
      },
      owner: {
        _id: owner._id,
        fullName: owner.fullName,
        displayName: owner.displayName,
        profile_pic: owner.profile_pic,
        phoneNumber: owner.phoneNumber,
        email: owner.email
      }
    });

  } catch (error) {
    console.error("Get accommodations by owner error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching owner's accommodations"
    });
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodation,
  updateAccommodation,
  deleteAccommodation,
  updateAccommodationStatus,
  getAccommodationsByOwner,
};