const multer = require('multer');
const path = require('path');

// Configure storage for profile pictures
const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pics/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Configure storage for government IDs
const govIdStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/government-ids/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize uploads
const uploadProfilePic = multer({ 
  storage: profilePicStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 1000000 } // 1MB limit
});

const uploadGovId = multer({ 
  storage: govIdStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2000000 } // 2MB limit
});

// Combined upload middleware
exports.uploadOwnerFiles = (req, res, next) => {
  const uploadProfile = uploadProfilePic.single('profilePic');
  const uploadGov = uploadGovId.single('governmentId');

  uploadProfile(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    uploadGov(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  });
};

// Alternative for multiple files
exports.uploadMultipleFiles = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: {
    fileSize: 2000000, // 2MB limit
    files: 2 // Maximum 2 files
  }
}).fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'governmentId', maxCount: 1 }
]);