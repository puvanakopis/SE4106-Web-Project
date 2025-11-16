const express = require("express");
const router = express.Router();
const {
    createTransportBooking,
    getTransportBookings,
    getTransportBooking,
    getBookingsByRenter,
    getBookingsByOwner,
    updateTransportBooking,
    deleteTransportBooking,
    addReview
} = require("../controllers/transportBookingController");


router.get("/", getTransportBookings);
router.post("/", createTransportBooking);
router.get("/:id", getTransportBooking);
router.put("/:id", updateTransportBooking);
router.delete("/:id", deleteTransportBooking);
router.get("/renter/:renterId", getBookingsByRenter);
router.get("/owner/:ownerId", getBookingsByOwner);
router.post("/:id/review", addReview);

module.exports = router;