const express = require("express");
const router = express.Router();
const {
    createAccommodation,
    getAccommodations,
    getAccommodation,
    updateAccommodation,
    deleteAccommodation,
    updateAccommodationAvailability,
    updateAccommodationStatus,
    toggleAccommodationAvailability
} = require("../controllers/accommodationController");

router.use('/uploads/accommodations', express.static('uploads/accommodations'));

router.post("/", createAccommodation);
router.get("/", getAccommodations);
router.get("/:id", getAccommodation);
router.put("/:id", updateAccommodation);
router.delete("/:id", deleteAccommodation);
router.patch("/:id/availability", updateAccommodationAvailability);
router.patch("/:id/availability/toggle", toggleAccommodationAvailability);
router.patch("/:id/status", updateAccommodationStatus);

module.exports = router;