const mongoose = require('mongoose');
const Counter = require('./Counter');

const ownerSchema = new mongoose.Schema({
  _id: { type: String },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  profilePic: {
    type: String,
    default: ''
  },
  governmentId: {
    type: String,
    default: ''
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    branch: String
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to generate custom ID
ownerSchema.pre('save', async function(next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
    return next();
  }
  
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'ownerId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this._id = `Owner_${String(counter.value).padStart(2, '0')}`;
    this.updatedAt = Date.now();
    next();
  } catch (err) {
    next(err);
  }
});

// Transform output to remove sensitive data
ownerSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;