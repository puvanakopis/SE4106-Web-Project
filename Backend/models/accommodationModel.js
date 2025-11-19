const mongoose = require("mongoose");
const Counter = require("./counterModel");

const accommodationSchema = new mongoose.Schema({
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
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ["Single Bed", "Double Bed", "Other"]
    },
    property_type: {
        type: String,
        required: true,
        enum: ["Hostel", "Apartment", "House", "Other"]
    },
    price_per_month: {
        type: Number,
        required: true,
        min: 0
    },
    deposit_amount: {
        type: Number,
        required: true,
        min: 0
    },
    bedrooms: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    bathrooms: {
        type: Number,
        required: true,
        min: 1,
        max: 10
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
    images: [{
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
            ref: 'AccommodationBooking',
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

accommodationSchema.pre("save", async function (next) {
    const doc = this;

    if (!doc._id) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { id: "accommodation" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const seqNumber = String(counter.seq).padStart(2, "0");
            doc._id = `accommodation_${seqNumber}`;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

accommodationSchema.pre("save", function (next) {
    this.lastUpdated = Date.now();
    next();
});

accommodationSchema.index({ owner_id: 1 });
accommodationSchema.index({ type: 1 });
accommodationSchema.index({ property_type: 1 });
accommodationSchema.index({ available: 1 });
accommodationSchema.index({ status: 1 });
accommodationSchema.index({ price_per_month: 1 });
accommodationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Accommodation", accommodationSchema);