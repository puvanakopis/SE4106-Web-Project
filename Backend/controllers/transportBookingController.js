const TransportBooking = require("../models/transportBookingModel");
const Transport = require("../models/transportModel");
const Owner = require("../models/ownerModel");
const User = require("../models/userModel");


const createTransportBooking = async (req, res) => {
    try {
        const { renter, transport, booking_start, booking_end, totalPrice, isPaid } = req.body;

        const transportData = await Transport.findById(transport);
        if (!transportData) {
            return res.status(404).json({ success: false, message: "Transport not found" });
        }

        const renterUser = await User.findById(renter);
        if (!renterUser) {
            return res.status(404).json({ success: false, message: "Renter not found" });
        }

        const owner = await Owner.findById(transportData.owner_id);
        if (!owner) {
            return res.status(404).json({ success: false, message: "Owner not found" });
        }

        const booking = new TransportBooking({
            renter,
            owner: transportData.owner_id,
            transport,
            booking_start,
            booking_end,
            totalPrice,
            isPaid,
            booking_status: "confirmed"
        });

        await booking.save();

        res.status(201).json({
            success: true,
            booking
        });

    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getTransportBookings = async (req, res) => {
    try {
        const bookings = await TransportBooking.find()
            .populate("renter", "fullName email phone")
            .populate("owner", "fullName displayName phoneNumber")
            .populate("transport");

        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Get bookings error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getTransportBooking = async (req, res) => {
    try {
        const booking = await TransportBooking.findById(req.params.id)
            .populate("renter", "fullName email phone")
            .populate("owner", "fullName displayName phoneNumber")
            .populate("transport");

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, booking });
    } catch (error) {
        console.error("Get booking error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getBookingsByRenter = async (req, res) => {
    try {
        const bookings = await TransportBooking.find({ renter: req.params.renterId })
            .populate("transport")
            .populate("owner", "fullName phoneNumber");

        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Get renter bookings error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getBookingsByOwner = async (req, res) => {
    try {
        const bookings = await TransportBooking.find({ owner: req.params.ownerId })
            .populate("transport")
            .populate("renter", "fullName email phone");

        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Get owner bookings error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const updateTransportBooking = async (req, res) => {
    try {
        const booking = await TransportBooking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, booking });
    } catch (error) {
        console.error("Update booking error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteTransportBooking = async (req, res) => {
    try {
        const booking = await TransportBooking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, message: "Booking deleted" });
    } catch (error) {
        console.error("Delete booking error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = {
    createTransportBooking,
    getTransportBookings,
    getTransportBooking,
    getBookingsByRenter,
    getBookingsByOwner,
    updateTransportBooking,
    deleteTransportBooking
};