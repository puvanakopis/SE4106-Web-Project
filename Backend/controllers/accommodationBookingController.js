const AccommodationBooking = require("../models/accommodationBookingModel");
const Accommodation = require("../models/accommodationModel");
const Owner = require("../models/ownerModel");
const User = require("../models/userModel");

const createAccommodationBooking = async (req, res) => {
    try {
        const {
            renter,
            accommodation,
            booking_start,
            booking_end,
            numberOfGuests,
            securityDeposit,
            totalPrice,
            paymentMethod,
            paymentDetails,
            specialRequests,
        } = req.body;

        if (!renter || !accommodation || !booking_start || !booking_end ||
            !numberOfGuests || !securityDeposit || !totalPrice || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        const accommodationData = await Accommodation.findById(accommodation);
        if (!accommodationData) {
            return res.status(404).json({
                success: false,
                message: "Accommodation not found"
            });
        }

        const owner = await Owner.findById(accommodationData.owner_id);
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        if (!accommodationData.owner_id) {
            return res.status(400).json({
                success: false,
                message: "Accommodation does not have an owner assigned"
            });
        }

        if (numberOfGuests > accommodationData.maxGuests) {
            return res.status(400).json({
                success: false,
                message: `Number of guests exceeds maximum capacity of ${accommodationData.maxGuests}`
            });
        }

        const renterUser = await User.findById(renter);
        if (!renterUser) {
            return res.status(404).json({
                success: false,
                message: "Renter not found"
            });
        }

        const existingBooking = await AccommodationBooking.findOne({
            accommodation,
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
                message: "Accommodation is already booked for the selected dates"
            });
        }

        const booking = new AccommodationBooking({
            renter,
            owner: accommodationData.owner_id,
            accommodation,
            booking_start: new Date(booking_start),
            booking_end: new Date(booking_end),
            numberOfGuests,
            securityDeposit,
            totalPrice,
            paymentMethod,
            specialRequests,
            paymentDetails: {
                ...paymentDetails,
                paymentDate: new Date(),
                paymentAmount: totalPrice,
            },
        });

        await booking.save();

        const populatedBooking = await AccommodationBooking.findById(booking._id)
            .populate("renter", "fullName email phone")
            .populate("owner", "fullName displayName phoneNumber")
            .populate("accommodation");

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: populatedBooking
        });

    } catch (error) {
        console.error("Create accommodation booking error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getAccommodationBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = {};
        if (status && ["confirmed", "cancelled", "completed"].includes(status)) {
            query.booking_status = status;
        }

        const bookings = await AccommodationBooking.find(query)
            .populate("renter", "fullName email phone")
            .populate({
                path: "owner",
                select: "fullName displayName phoneNumber email firstName lastName",
                model: [Owner, User]
            })
            .populate("accommodation")
            .sort({ createdDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AccommodationBooking.countDocuments(query);

        res.json({
            success: true,
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Get accommodation bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getAccommodationBooking = async (req, res) => {
    try {
        const booking = await AccommodationBooking.findById(req.params.id)
            .populate("renter", "fullName email phone")
            .populate({
                path: "owner",
                select: "fullName displayName phoneNumber email firstName lastName",
                model: [Owner, User]
            })
            .populate("accommodation");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({ success: true, booking });
    } catch (error) {
        console.error("Get accommodation booking error:", error);
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

        const bookings = await AccommodationBooking.find(query)
            .populate("accommodation")
            .populate({
                path: "owner",
                select: "fullName displayName phoneNumber email firstName lastName",
                model: [Owner, User]
            })
            .sort({ createdDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AccommodationBooking.countDocuments(query);

        res.json({
            success: true,
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Get renter accommodation bookings error:", error);
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

        const bookings = await AccommodationBooking.find(query)
            .populate("accommodation")
            .populate("renter", "fullName email phone")
            .sort({ createdDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AccommodationBooking.countDocuments(query);

        res.json({
            success: true,
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Get owner accommodation bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const updateAccommodationBooking = async (req, res) => {
    try {
        const allowedUpdates = [
            'booking_status',
            'paymentDetails',
            'review',
            'booking_start',
            'booking_end',
            'totalPrice',
            'numberOfGuests',
            'specialRequests'
        ];

        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: "Invalid updates"
            });
        }

        const booking = await AccommodationBooking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("renter", "fullName email phone")
            .populate({
                path: "owner",
                select: "fullName displayName phoneNumber email firstName lastName",
                model: [Owner, User]
            })
            .populate("accommodation");

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
        console.error("Update accommodation booking error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { cancellationReason } = req.body;

        const booking = await AccommodationBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.booking_status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        if (booking.booking_status === 'completed') {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel completed booking"
            });
        }

        booking.booking_status = 'cancelled';
        booking.cancellationReason = cancellationReason;
        booking.cancellationDate = new Date();

        await booking.save();

        const updatedBooking = await AccommodationBooking.findById(booking._id)
            .populate("renter", "fullName email phone")
            .populate({
                path: "owner",
                select: "fullName displayName phoneNumber email firstName lastName",
                model: [Owner, User]
            })
            .populate("accommodation");

        res.json({
            success: true,
            message: "Booking cancelled successfully",
            booking: updatedBooking
        });
    } catch (error) {
        console.error("Cancel booking error:", error);
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

        const booking = await AccommodationBooking.findById(req.params.id)
            .populate("accommodation")
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

        const accommodation = await Accommodation.findById(booking.accommodation._id);
        if (accommodation) {
            accommodation.ratingCount[rating] = (accommodation.ratingCount[rating] || 0) + 1;

            const totalRatings = Object.values(accommodation.ratingCount).reduce((sum, count) => sum + count, 0);
            const ratingSum = Object.entries(accommodation.ratingCount).reduce((sum, [star, count]) => sum + (parseInt(star) * count), 0);
            accommodation.averageRating = totalRatings > 0 ? ratingSum / totalRatings : 0;
            accommodation.totalReviews = totalRatings;

            accommodation.reviews.push({
                booking: booking._id,
                renter: booking.renter._id,
                rating,
                comment,
                reviewDate: new Date()
            });

            await accommodation.save();
        }

        const owner = await Owner.findById(booking.owner._id);
        if (owner) {
            if (!owner.ratingCount) {
                owner.ratingCount = {
                    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
                };
            }

            owner.ratingCount[rating] = (owner.ratingCount[rating] || 0) + 1;

            const totalRatings = Object.values(owner.ratingCount).reduce((sum, count) => sum + count, 0);
            const ratingSum = Object.entries(owner.ratingCount).reduce((sum, [star, count]) => sum + (parseInt(star) * count), 0);
            owner.averageRating = totalRatings > 0 ? ratingSum / totalRatings : 0;
            owner.totalReviews = totalRatings;

            await owner.save();
        }

        const updatedBooking = await AccommodationBooking.findById(booking._id)
            .populate("renter", "fullName email phone")
            .populate({
                path: "owner",
                select: "fullName displayName phoneNumber email firstName lastName",
                model: [Owner, User]
            })
            .populate("accommodation");

        res.json({
            success: true,
            message: "Review added successfully to both accommodation and owner",
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
    createAccommodationBooking,
    getAccommodationBookings,
    getAccommodationBooking,
    getBookingsByRenter,
    getBookingsByOwner,
    updateAccommodationBooking,
    addReview,
    cancelBooking
};