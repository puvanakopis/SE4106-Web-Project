const express = require("express");
const router = express.Router();
const {
    createAccommodationBooking,
    getAccommodationBookings,
    getAccommodationBooking,
    getBookingsByRenter,
    getBookingsByOwner,
    updateAccommodationBooking,
    addReview,
    cancelBooking
} = require("../controllers/accommodationBookingController");

router.get("/", getAccommodationBookings);
router.post("/", createAccommodationBooking);
router.get("/:id", getAccommodationBooking);
router.put("/:id", updateAccommodationBooking);
router.patch("/:id/cancel", cancelBooking);
router.get("/renter/:renterId", getBookingsByRenter);
router.get("/owner/:ownerId", getBookingsByOwner);
router.post("/:id/review", addReview);

module.exports = router;