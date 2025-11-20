const mongoose = require("mongoose");
const Counter = require("./counterModel");

const ownerSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    displayName: {
        type: String,
        trim: true,
        maxlength: 50
    },
    profile_pic: {
        type: String,
        default: null
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        default: "Owner"
    },
    verified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Active", "Blocked"],
        default: "Active"
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    ratingCount: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 }
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    bankDetails: {
        accountNumber: String,
        bankName: String,
        branch: String
    }
});

ownerSchema.pre("save", async function (next) {
    const doc = this;

    if (!doc._id) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { id: "owner" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const seqNumber = String(counter.seq).padStart(2, "0");
            doc._id = `owner_${seqNumber}`;

            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model("Owner", ownerSchema);