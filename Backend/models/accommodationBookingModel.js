const mongoose = require("mongoose");
const Counter = require("./counterModel");

const accommodationBookingSchema = new mongoose.Schema({
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
    accommodation: {
        type: String,
        ref: "Accommodation",
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
    numberOfGuests: {
        type: Number,
        required: true,
        min: 1
    },
    securityDeposit: {
        type: Number,
        required: true,
        default: 0,
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
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'cash', 'online'],
        default: 'cash',
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
        },
        transactionId: String
    },
    specialRequests: {
        type: String,
        maxlength: 500
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
    cancellationReason: String,
    cancellationDate: Date,
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    }
});

accommodationBookingSchema.pre("save", async function (next) {
    const doc = this;

    if (!doc._id) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { id: "accommodationBooking" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const seqNumber = String(counter.seq).padStart(2, "0");
            doc._id = `accommodationbooking_${seqNumber}`;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        doc.updatedDate = Date.now();
        next();
    }
});

module.exports = mongoose.model("AccommodationBooking", accommodationBookingSchema);