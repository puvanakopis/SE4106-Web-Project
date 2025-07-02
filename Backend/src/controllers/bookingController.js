const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Transport = require('../models/Transport');
const { protect } = require('../middleware/auth');

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const { itemId, itemType, startDate, endDate } = req.body;

    // Check if item exists and is available
    let item;
    if (itemType === 'Room') {
      item = await Room.findById(itemId);
    } else {
      item = await Transport.findById(itemId);
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check for availability
    const existingBooking = await Booking.findOne({
      item: itemId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Item is not available during selected dates' });
    }

    // Calculate total amount
    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalAmount = itemType === 'Room' ? item.price * totalDays : item.pricePerDay * totalDays;

    const booking = new Booking({
      user: req.user.id,
      item: itemId,
      itemType,
      startDate,
      endDate,
      totalAmount,
      ...req.body
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('item', 'title price')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete booking
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'completed';
    await booking.save();

    res.json({ message: 'Booking completed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, paymentReference } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.paymentStatus = 'paid';
    booking.paymentMethod = paymentMethod;
    booking.paymentReference = paymentReference;
    await booking.save();

    res.json({ message: 'Payment processed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('item', 'title price')
      .populate('user', 'firstName lastName');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
