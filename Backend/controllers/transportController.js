const Transport = require("../models/transportModel");
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

const processFeatures = (features) => {
  if (typeof features === 'string') {
    try {
      return JSON.parse(features);
    } catch (e) {
      return features.split(',').map(f => f.trim());
    }
  }
  return features;
};

const renameUploadedFiles = async (files, transportId, existingCount = 0) => {
  const renamedFiles = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imageNumber = existingCount + i + 1;
    const newFilename = `${transportId}_${imageNumber}${path.extname(file.originalname)}`;
    const newPath = path.join(path.dirname(file.path), newFilename);

    try {
      fs.renameSync(file.path, newPath);
      renamedFiles.push(`/uploads/transports/${newFilename}`);
    } catch (renameErr) {
      console.error('Error renaming file:', renameErr);
      renamedFiles.push(`/uploads/transports/${path.basename(file.path)}`);
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
    const uploadPath = path.join(__dirname, '../uploads/transports');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const transportId = req.params.id || 'temp';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, transportId + '-' + uniqueSuffix + path.extname(file.originalname));
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

const uploadTransportImages = upload.array('images', 10);

const createTransport = async (req, res) => {
  try {
    uploadTransportImages(req, res, async function (err) {
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

      const transportData = {
        ...req.body,
        features: processFeatures(req.body.features),
        ...(Object.keys(locationData).length > 0 && { location: locationData })
      };

      delete transportData.coordinates;
      delete transportData.replaceImages;

      if (req.files?.length > 0) {
        transportData.images = req.files.map(file =>
          `/uploads/transports/${path.basename(file.path)}`
        );
      }

      const transport = new Transport(transportData);
      await transport.save();

      if (req.files?.length > 0) {
        transport.images = await renameUploadedFiles(req.files, transport._id);
        await transport.save();
      }

      await transport.populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews');

      res.status(201).json({
        success: true,
        message: "Transport created successfully",
        transport
      });
    });
  } catch (error) {
    console.error("Create transport error:", error);
    cleanupFiles(req.files);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Registration number already exists"
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
      message: "Server error while creating transport"
    });
  }
};

const getTransports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      min_price,
      max_price,
      fuel_type,
      search,
      isAvailable,
      status,
      min_seating,
      max_seating,
      min_year,
      max_year,
      sort_by = 'createdDate',
      sort_order = 'desc',
      location_lat,
      location_lng,
      max_distance = 50000
    } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (fuel_type) filter.fuel_type = fuel_type;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
    if (status) filter.status = status;

    if (min_price || max_price) {
      filter.rental_price_per_day = {};
      if (min_price) filter.rental_price_per_day.$gte = parseInt(min_price);
      if (max_price) filter.rental_price_per_day.$lte = parseInt(max_price);
    }

    if (min_seating || max_seating) {
      filter.seating_capacity = {};
      if (min_seating) filter.seating_capacity.$gte = parseInt(min_seating);
      if (max_seating) filter.seating_capacity.$lte = parseInt(max_seating);
    }

    if (min_year || max_year) {
      filter.year = {};
      if (min_year) filter.year.$gte = parseInt(min_year);
      if (max_year) filter.year.$lte = parseInt(max_year);
    }

    if (search) {
      filter.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
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

    const [transports, total] = await Promise.all([
      Transport.find(filter)
        .populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews')
        .sort(sortConfig)
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Transport.countDocuments(filter)
    ]);

    res.json({
      success: true,
      transports,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error("Get transports error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching transports"
    });
  }
};

const getTransport = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id)
      .populate('owner_id', 'fullName displayName profile_pic phoneNumber email address averageRating totalReviews ratingCount');

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: "Transport not found"
      });
    }

    res.json({
      success: true,
      transport
    });
  } catch (error) {
    console.error("Get transport error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching transport"
    });
  }
};

const updateTransport = async (req, res) => {
  try {
    uploadTransportImages(req, res, async function (err) {
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
        features: processFeatures(req.body.features),
        ...(Object.keys(locationData).length > 0 && { location: locationData })
      };

      delete updateData.coordinates;
      delete updateData.replaceImages;

      if (req.files?.length > 0) {
        const existingTransport = await Transport.findById(req.params.id);
        const existingImagesCount = existingTransport ? existingTransport.images.length : 0;

        const newImages = await renameUploadedFiles(req.files, req.params.id, existingImagesCount);

        if (updateData.replaceImages === 'true') {
          if (existingTransport?.images) {
            existingTransport.images.forEach(imagePath => {
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
          updateData.images = [...(existingTransport?.images || []), ...newImages];
        }
      }

      const transport = await Transport.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews');

      if (!transport) return handleFileError(req.files, res, "Transport not found");

      res.json({
        success: true,
        message: "Transport updated successfully",
        transport
      });
    });
  } catch (error) {
    console.error("Update transport error:", error);
    cleanupFiles(req.files);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Registration number already exists"
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
      message: "Server error while updating transport"
    });
  }
};

const deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({
        success: false,
        message: "Transport not found"
      });
    }

    if (transport.images?.length > 0) {
      transport.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (unlinkErr) {
            console.error('Error deleting transport image:', unlinkErr);
          }
        }
      });

      const uploadDir = path.join(__dirname, '../uploads/transports');
      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        files.forEach(file => {
          if (file.startsWith(req.params.id + '_')) {
            try {
              fs.unlinkSync(path.join(uploadDir, file));
            } catch (cleanupErr) {
              console.error('Error cleaning up transport files:', cleanupErr);
            }
          }
        });
      }
    }

    await Transport.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Transport deleted successfully"
    });
  } catch (error) {
    console.error("Delete transport error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting transport"
    });
  }
};

const updateTransportStatus = async (req, res) => {
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

    const transport = await Transport.findByIdAndUpdate(
      id,
      { status, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    ).populate("owner_id", "fullName displayName profile_pic phoneNumber email");

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: "Transport not found"
      });
    }

    return res.json({
      success: true,
      message: `Transport status updated to ${status}`,
      transport
    });

  } catch (error) {
    console.error("Update transport status error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating transport status"
    });
  }
};

const getTransportsByOwner = async (req, res) => {
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
      status,
      isAvailable,
      sort_by = 'createdDate',
      sort_order = 'desc'
    } = req.query;

    const filter = { owner_id };

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    const sortConfig = { [sort_by]: sort_order === 'desc' ? -1 : 1 };

    const [transports, total] = await Promise.all([
      Transport.find(filter)
        .populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews')
        .sort(sortConfig)
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Transport.countDocuments(filter)
    ]);

    const stats = await Transport.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalVehicles: { $sum: 1 },
          availableVehicles: {
            $sum: { $cond: [{ $eq: ["$available", "Available"] }, 1, 0] }
          },
          activeVehicles: {
            $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
          },
          averageRating: { $avg: "$averageRating" },
          totalRevenue: { $sum: "$rental_price_per_day" }
        }
      }
    ]);

    const statistics = stats[0] || {
      totalVehicles: 0,
      availableVehicles: 0,
      activeVehicles: 0,
      averageRating: 0,
      totalRevenue: 0
    };

    res.json({
      success: true,
      transports,
      statistics,
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
        profile_pic: owner.profile_pic
      }
    });

  } catch (error) {
    console.error("Get transports by owner error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching owner's transports"
    });
  }
};


module.exports = {
  createTransport,
  getTransports,
  getTransport,
  updateTransport,
  deleteTransport,
  updateTransportStatus,
  getTransportsByOwner
};