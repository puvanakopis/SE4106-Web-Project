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
    securityDeposit: {
        type: Number,
        required: true,
        min: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    booking_status: {
        type: String,
        enum: ["confirmed", "cancelled", "completed"],
        default: "confirmed"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'cash'],
        required: true
    },
    paymentDetails: {
        cardNumber: String,
        cardHolderName: String,
        paymentDate: Date,
        paymentAmount: Number,
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        }
    },
    review: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        reviewDate: Date
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