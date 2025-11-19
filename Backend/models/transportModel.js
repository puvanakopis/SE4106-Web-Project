const mongoose = require("mongoose");
const Counter = require("./counterModel");

const transportSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    owner_id: {
        type: String,
        ref: 'Owner',
        required: true
    },
    available: {
        type: String,
        enum: ["Available", "Occupied"],
        default: "Available"
    },
    status: {
        type: String,
        enum: ["Active", "Blocked"],
        default: "Active"
    },
    vehicle_name: {
        type: String,
        required: true,
        trim: true
    },
    vehicle_type: {
        type: String,
        required: true,
        enum: ["Motorbike", "Car", "Scooter", "Bicycle", "Van", "Bus", "Other"]
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    fuel_type: {
        type: String,
        required: true,
        enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "Other"]
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    registration_number: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    rental_price_per_day: {
        type: Number,
        required: true,
        min: 0
    },
    deposit_amount: {
        type: Number,
        required: true,
        min: 0
    },
    seating_capacity: {
        type: Number,
        required: true,
        min: 1,
        max: 50
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        },
        mapSrc: {
            type: String,
            trim: true
        },
        title: {
            type: String,
            trim: true
        }
    },
    features: [{
        type: String,
        trim: true
    }],
    vehicle_images: [{
        type: String
    }],
    description: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ""
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    ratingCount: {
        "1": { type: Number, default: 0 },
        "2": { type: Number, default: 0 },
        "3": { type: Number, default: 0 },
        "4": { type: Number, default: 0 },
        "5": { type: Number, default: 0 }
    },
    reviews: [{
        booking: {
            type: String,
            ref: 'TransportBooking',
            required: true
        },
        renter: {
            type: String,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 500
        },
        reviewDate: {
            type: Date,
            default: Date.now
        }
    }],
    createdDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

transportSchema.pre("save", async function (next) {
    const doc = this;

    if (!doc._id) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { id: "transport" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const seqNumber = String(counter.seq).padStart(2, "0");
            doc._id = `transport_${seqNumber}`;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

transportSchema.pre("save", function (next) {
    this.lastUpdated = Date.now();
    next();
});

transportSchema.index({ owner_id: 1 });
transportSchema.index({ vehicle_type: 1 });
transportSchema.index({ isAvailable: 1 });
transportSchema.index({ rental_price_per_day: 1 });
transportSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Transport", transportSchema);