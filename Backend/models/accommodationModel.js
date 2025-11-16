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
    accommodationName: {
        type: String,
        required: true,
        trim: true
    },
    accommodationType: {
        type: String,
        required: true,
        enum: ["Single Bed", "Double Bed", "Triple Sharing", "Annexe"]
    },
    pricePerMonth: {
        type: Number,
        required: true,
        min: 0
    },
    SecurityDeposit: {
        type: Number,
        required: true,
        min: 0
    },
    noOfBed: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    isAvailable: {
        type: Boolean,
        default: true
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
    description: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ""
    },
    amenities: [{
        type: String,
        trim: true
    }],
    images: [{
        type: String
    }],
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
    status: {
        type: String,
        enum: ["Active", "Blocked"],
        default: "Active"
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
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

// Update lastUpdated timestamp
accommodationSchema.pre("save", function (next) {
    this.lastUpdated = Date.now();
    next();
});

// Indexes for better performance
accommodationSchema.index({ owner_id: 1 });
accommodationSchema.index({ accommodationType: 1 });
accommodationSchema.index({ isAvailable: 1 });
accommodationSchema.index({ pricePerMonth: 1 });
accommodationSchema.index({ status: 1 });
accommodationSchema.index({ noOfBed: 1 });
accommodationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Accommodation", accommodationSchema);