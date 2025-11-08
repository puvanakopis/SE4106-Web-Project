const Transport = require("../models/transportModel");
const Owner = require("../models/ownerModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


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
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const uploadTransportImages = upload.array('vehicle_images', 10);


const createTransport = async (req, res) => {
    try {
        uploadTransportImages(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            const owner = await Owner.findById(req.body.owner_id);
            if (!owner) {
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    });
                }
                return res.status(404).json({
                    success: false,
                    message: "Owner not found"
                });
            }

            const transportData = { ...req.body };

            if (req.files && req.files.length > 0) {
                transportData.vehicle_images = req.files.map(file =>
                    `/uploads/transports/${path.basename(file.path)}`
                );
            }

            if (typeof transportData.features === 'string') {
                try {
                    transportData.features = JSON.parse(transportData.features);
                } catch (e) {
                    transportData.features = transportData.features.split(',').map(f => f.trim());
                }
            }

            const transport = new Transport(transportData);
            await transport.save();

            if (req.files && req.files.length > 0) {
                const updatedImages = [];

                for (const file of req.files) {
                    const oldPath = file.path;
                    const newFilename = transport._id + '-' + Date.now() + path.extname(file.originalname);
                    const newPath = path.join(path.dirname(oldPath), newFilename);

                    try {
                        fs.renameSync(oldPath, newPath);
                        updatedImages.push(`/uploads/transports/${newFilename}`);
                    } catch (renameErr) {
                        console.error('Error renaming file:', renameErr);
                        updatedImages.push(`/uploads/transports/${path.basename(oldPath)}`);
                    }
                }

                transport.vehicle_images = updatedImages;
                await transport.save();
            }

            await transport.populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews');

            res.status(201).json({
                success: true,
                transport
            });
        });
    } catch (error) {
        console.error("Create transport error:", error);

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

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
            message: "Server error"
        });
    }
};


const getTransports = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            vehicle_type,
            min_price,
            max_price,
            fuel_type,
            search,
            isAvailable,
            sort_by = 'createdDate',
            sort_order = 'desc'
        } = req.query;

        const filter = {};

        if (vehicle_type) filter.vehicle_type = vehicle_type;
        if (fuel_type) filter.fuel_type = fuel_type;
        if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

        if (min_price || max_price) {
            filter.rental_price_per_day = {};
            if (min_price) filter.rental_price_per_day.$gte = parseInt(min_price);
            if (max_price) filter.rental_price_per_day.$lte = parseInt(max_price);
        }

        if (search) {
            filter.$or = [
                { brand: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        const sortConfig = {};
        sortConfig[sort_by] = sort_order === 'desc' ? -1 : 1;

        const transports = await Transport.find(filter)
            .populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews')
            .sort(sortConfig)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Transport.countDocuments(filter);

        res.json({
            success: true,
            transports,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error("Get transports error:", error);
        res.status(500).json({ success: false, message: "Server error" });
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

        res.json({ success: true, transport });
    } catch (error) {
        console.error("Get transport error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const getTransportsByOwner = async (req, res) => {
    try {
        const { owner_id } = req.params;
        const { page = 1, limit = 10, isAvailable } = req.query;

        const filter = { owner_id };
        if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

        const transports = await Transport.find(filter)
            .populate('owner_id', 'fullName displayName profile_pic phoneNumber email')
            .sort({ createdDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Transport.countDocuments(filter);

        res.json({
            success: true,
            transports,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error("Get transports by owner error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const updateTransport = async (req, res) => {
    try {
        uploadTransportImages(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            const updateData = { ...req.body };

            if (typeof updateData.features === 'string') {
                try {
                    updateData.features = JSON.parse(updateData.features);
                } catch (e) {
                    updateData.features = updateData.features.split(',').map(f => f.trim());
                }
            }

            if (req.files && req.files.length > 0) {
                const newImages = req.files.map(file =>
                    `/uploads/transports/${path.basename(file.path)}`
                );

                if (updateData.replaceImages === 'true') {
                    const existingTransport = await Transport.findById(req.params.id);
                    if (existingTransport && existingTransport.vehicle_images) {

                        existingTransport.vehicle_images.forEach(imagePath => {
                            const fullPath = path.join(__dirname, '..', imagePath);
                            if (fs.existsSync(fullPath)) {
                                fs.unlinkSync(fullPath);
                            }
                        });
                    }
                    updateData.vehicle_images = newImages;
                } else {

                    const existingTransport = await Transport.findById(req.params.id);
                    const existingImages = existingTransport ? existingTransport.vehicle_images : [];
                    updateData.vehicle_images = [...existingImages, ...newImages];
                }
            }

            const transport = await Transport.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            ).populate('owner_id', 'fullName displayName profile_pic phoneNumber email averageRating totalReviews');

            if (!transport) {

                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    });
                }
                return res.status(404).json({
                    success: false,
                    message: "Transport not found"
                });
            }

            res.json({ success: true, transport });
        });
    } catch (error) {
        console.error("Update transport error:", error);

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

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
            message: "Server error"
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

        if (transport.vehicle_images && transport.vehicle_images.length > 0) {
            transport.vehicle_images.forEach(imagePath => {
                const fullPath = path.join(__dirname, '..', imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });

            const uploadDir = path.join(__dirname, '../uploads/transports');
            if (fs.existsSync(uploadDir)) {
                const files = fs.readdirSync(uploadDir);
                files.forEach(file => {
                    if (file.startsWith(req.params.id + '-')) {
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
            message: "Server error"
        });
    }
};


const updateTransportRating = async (req, res) => {
    try {
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const transport = await Transport.findById(req.params.id);
        if (!transport) {
            return res.status(404).json({
                success: false,
                message: "Transport not found"
            });
        }

        const ratingKey = rating.toString();
        transport.ratingCount[ratingKey] = (transport.ratingCount[ratingKey] || 0) + 1;

        const totalRatings = Object.values(transport.ratingCount).reduce((sum, count) => sum + count, 0);
        const weightedSum = Object.entries(transport.ratingCount).reduce((sum, [star, count]) => {
            return sum + (parseInt(star) * count);
        }, 0);

        transport.averageRating = weightedSum / totalRatings;
        transport.totalReviews = totalRatings;

        await transport.save();

        res.json({
            success: true,
            transport
        });
    } catch (error) {
        console.error("Update transport rating error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const deleteTransportImage = async (req, res) => {
    try {
        const { id, imageIndex } = req.params;

        const transport = await Transport.findById(id);
        if (!transport) {
            return res.status(404).json({
                success: false,
                message: "Transport not found"
            });
        }

        const index = parseInt(imageIndex);
        if (index < 0 || index >= transport.vehicle_images.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid image index"
            });
        }

        const imagePath = transport.vehicle_images[index];
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        transport.vehicle_images.splice(index, 1);
        await transport.save();

        res.json({
            success: true,
            message: "Image deleted successfully",
            transport
        });
    } catch (error) {
        console.error("Delete transport image error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    createTransport,
    getTransports,
    getTransport,
    getTransportsByOwner,
    updateTransport,
    deleteTransport,
    updateTransportRating,
    deleteTransportImage,
    uploadTransportImages
};