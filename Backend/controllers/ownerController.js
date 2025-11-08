const Owner = require("../models/ownerModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/owners');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    if (!req.params.id) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'temp-' + uniqueSuffix + path.extname(file.originalname));
    } else {
      cb(null, req.params.id + path.extname(file.originalname));
    }
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
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const uploadOwnerPhoto = upload.single('profile_pic');


const createOwner = async (req, res) => {
  try {
    uploadOwnerPhoto(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      const ownerData = { ...req.body };

      const owner = new Owner(ownerData);
      await owner.save();

      if (req.file && owner._id) {
        const oldPath = req.file.path;
        const newFilename = owner._id + path.extname(req.file.originalname);
        const newPath = path.join(path.dirname(oldPath), newFilename);

        fs.renameSync(oldPath, newPath);

        owner.profile_pic = `/uploads/owners/${newFilename}`;
        await owner.save();

        const uploadDir = path.dirname(oldPath);
        const files = fs.readdirSync(uploadDir);
        files.forEach(file => {
          if (file.startsWith('temp-') && file.includes(path.extname(req.file.originalname))) {
            try {
              fs.unlinkSync(path.join(uploadDir, file));
            } catch (cleanupErr) {
              console.error('Error cleaning up temp files:', cleanupErr);
            }
          }
        });
      } else if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      res.status(201).json({
        success: true,
        owner
      });
    });
  } catch (error) {
    console.error("Create owner error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


const getOwners = async (req, res) => {
  try {
    const owners = await Owner.find();
    res.json({ success: true, owners });
  } catch (error) {
    console.error("Get owners error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getOwner = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({ success: false, message: "Owner not found" });
    res.json({ success: true, owner });
  } catch (error) {
    console.error("Get owner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateOwner = async (req, res) => {
  try {
    uploadOwnerPhoto(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      const updateData = { ...req.body };

      if (req.file) {
        const ownerId = req.params.id;

        const existingOwner = await Owner.findById(ownerId);
        if (existingOwner && existingOwner.profile_pic) {
          const oldImagePath = path.join(__dirname, '..', existingOwner.profile_pic);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        const oldPath = req.file.path;
        const newFilename = ownerId + path.extname(req.file.originalname);
        const newPath = path.join(path.dirname(oldPath), newFilename);

        fs.renameSync(oldPath, newPath);
        updateData.profile_pic = `/uploads/owners/${newFilename}`;
      }

      const owner = await Owner.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!owner) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({
          success: false,
          message: "Owner not found"
        });
      }

      res.json({ success: true, owner });
    });
  } catch (error) {
    console.error("Update owner error:", error);

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


const deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({
      success: false,
      message: "Owner not found"
    });

    if (owner.profile_pic) {
      const imagePath = path.join(__dirname, '..', owner.profile_pic);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      const uploadDir = path.join(__dirname, '../uploads/owners');
      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        files.forEach(file => {
          if (file.startsWith(req.params.id + '.')) {
            try {
              fs.unlinkSync(path.join(uploadDir, file));
            } catch (cleanupErr) {
              console.error('Error cleaning up owner files:', cleanupErr);
            }
          }
        });
      }
    }

    await Owner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Owner deleted successfully"
    });
  } catch (error) {
    console.error("Delete owner error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  createOwner,
  getOwners,
  getOwner,
  updateOwner,
  deleteOwner,
  uploadOwnerPhoto
};