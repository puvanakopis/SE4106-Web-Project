const mongoose = require("mongoose");
const Counter = require("./counterModel");

const transportBookingSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    renter: {
        type: String,
        ref: "User",
        required: true
    },
    owner: {
        type: String,
        ref: "Owner",
        required: true
    },
    transport: {
        type: String,
        ref: "Transport",
        required: true
    },
    booking_start: {
        type: Date,
        required: true
    },
    booking_end: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    booking_status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

transportBookingSchema.pre("save", async function (next) {
    const doc = this;

    if (!doc._id) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { id: "transportBooking" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const seqNumber = String(counter.seq).padStart(2, "0");
            doc._id = `transportbooking_${seqNumber}`;
            next();
        } catch (err) {
            next(err);
        }
    } else next();
});

module.exports = mongoose.model("TransportBooking", transportBookingSchema);