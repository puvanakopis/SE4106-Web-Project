const express = require("express");
const router = express.Router();
const { createTransportBooking, getTransportBookings, getTransportBooking, getBookingsByRenter, getBookingsByOwner, updateTransportBooking, deleteTransportBooking } = require("../controllers/transportBookingController");


router.post("/", createTransportBooking);
router.get("/", getTransportBookings);
router.get("/renter/:renterId", getBookingsByRenter);
router.get("/owner/:ownerId", getBookingsByOwner);
router.get("/:id", getTransportBooking);
router.put("/:id", updateTransportBooking);
router.delete("/:id", deleteTransportBooking);

module.exports = router;