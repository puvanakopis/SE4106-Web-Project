const TransportBooking = require("../models/transportBookingModel");
const Transport = require("../models/transportModel");
const Owner = require("../models/ownerModel");
const User = require("../models/userModel");

const createTransportBooking = async (req, res) => {
    try {
        const {
            renter,
            transport,
            booking_start,
            booking_end,
            securityDeposit,
            totalPrice,
            paymentMethod,
            paymentDetails
        } = req.body;

        if (!renter || !transport || !booking_start || !booking_end ||
            !securityDeposit || !totalPrice || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        const transportData = await Transport.findById(transport);
        if (!transportData) {
            return res.status(404).json({
                success: false,
                message: "Transport not found"
            });
        }

        const renterUser = await User.findById(renter);
        if (!renterUser) {
            return res.status(404).json({
                success: false,
                message: "Renter not found"
            });
        }

        const owner = await Owner.findById(transportData.owner_id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        const existingBooking = await TransportBooking.findOne({
            transport,
            $or: [
                {
                    booking_start: { $lte: new Date(booking_end) },
                    booking_end: { $gte: new Date(booking_start) }
                }
            ],
            booking_status: { $in: "confirmed" }
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "Transport is already booked for the selected dates"
            });
        }

        const booking = new TransportBooking({
            renter,
            owner: transportData.owner_id,
            transport,
            booking_start: new Date(booking_start),
            booking_end: new Date(booking_end),
            securityDeposit,
            totalPrice,
            paymentMethod,
            paymentDetails: {
                ...paymentDetails,
                paymentDate: new Date(),
                paymentAmount: totalPrice,
            },
        });

        await booking.save();

        const populatedBooking = await TransportBooking.findById(booking._id)
            .populate("renter", "fullName email phone")
            .populate("owner", "fullName displayName phoneNumber")
            .populate("transport");

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: populatedBooking
        });

    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getTransportBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = {};
        if (status && ["confirmed", "cancelled", "completed"].includes(status)) {
            query.booking_status = status;
        }

        const bookings = await TransportBooking.find(query)
            .populate("renter", "fullName email phone")
            .populate("owner", "fullName displayName phoneNumber")
            .populate("transport")
            .sort({ createdDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await TransportBooking.countDocuments(query);

        res.json({
            success: true,
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Get bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getTransportBooking = async (req, res) => {
    try {
        const booking = await TransportBooking.findById(req.params.id)
            .populate("renter", "fullName email phone")
            .populate("owner", "fullName displayName phoneNumber")
            .populate("transport");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({ success: true, booking });
    } catch (error) {
        console.error("Get booking error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getBookingsByRenter = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = { renter: req.params.renterId };
        if (status && ["confirmed", "cancelled", "completed"].includes(status)) {
            query.booking_status = status;
        }

        const bookings = await TransportBooking.find(query)
            .populate("transport")
            .populate("owner", "fullName phoneNumber")
            .sort({ createdDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await TransportBooking.countDocuments(query);

        res.json({
            success: true,
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Get renter bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getBookingsByOwner = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = { owner: req.params.ownerId };
        if (status && ["confirmed", "cancelled", "completed"].includes(status)) {
            query.booking_status = status;
        }

        const bookings = await TransportBooking.find(query)
            .populate("transport")
            .populate("renter", "fullName email phone")
            .sort({ createdDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await TransportBooking.countDocuments(query);

        res.json({
            success: true,
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Get owner bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const updateTransportBooking = async (req, res) => {
    try {
        const allowedUpdates = [
            'booking_status',
            'paymentDetails',
            'review',
            'booking_start',
            'booking_end',
            'totalPrice'
        ];

        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: "Invalid updates"
            });
        }

        const booking = await TransportBooking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("renter", "fullName email phone")
            .populate("owner", "fullName displayName phoneNumber")
            .populate("transport");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            message: "Booking updated successfully",
            booking
        });
    } catch (error) {
        console.error("Update booking error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const booking = await TransportBooking.findById(req.params.id)
            .populate("transport")
            .populate("renter")
            .populate("owner");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.booking_status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: "Can only review completed bookings"
            });
        }

        if (booking.review && booking.review.rating) {
            return res.status(400).json({
                success: false,
                message: "Review already exists for this booking"
            });
        }

        booking.review = {
            rating,
            comment,
            reviewDate: new Date()
        };

        await booking.save();

        const transport = await Transport.findById(booking.transport._id);
        if (transport) {
            transport.ratingCount[rating] = (transport.ratingCount[rating] || 0) + 1;

            const totalRatings = Object.values(transport.ratingCount).reduce((sum, count) => sum + count, 0);
            const ratingSum = Object.entries(transport.ratingCount).reduce((sum, [star, count]) => sum + (parseInt(star) * count), 0);
            transport.averageRating = totalRatings > 0 ? ratingSum / totalRatings : 0;
            transport.totalReviews = totalRatings;

            transport.reviews.push({
                booking: booking._id,
                renter: booking.renter._id,
                rating,
                comment,
                reviewDate: new Date()
            });

            await transport.save();
        }

        const owner = await Owner.findById(booking.owner._id);
        if (owner) {

            owner.ratingCount[rating] = (owner.ratingCount[rating] || 0) + 1;

            const totalRatings = Object.values(owner.ratingCount).reduce((sum, count) => sum + count, 0);
            const ratingSum = Object.entries(owner.ratingCount).reduce((sum, [star, count]) => sum + (parseInt(star) * count), 0);
            owner.averageRating = totalRatings > 0 ? ratingSum / totalRatings : 0;
            owner.totalReviews = totalRatings;

            await owner.save();
        }

        const updatedBooking = await TransportBooking.findById(booking._id)
            .populate("renter", "fullName email phone")
            .populate("owner", "fullName displayName phoneNumber")
            .populate("transport");

        res.json({
            success: true,
            message: "Review added successfully to both transport and owner",
            booking: updatedBooking
        });
    } catch (error) {
        console.error("Add review error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createTransportBooking,
    getTransportBookings,
    getTransportBooking,
    getBookingsByRenter,
    getBookingsByOwner,
    updateTransportBooking,
    addReview
};