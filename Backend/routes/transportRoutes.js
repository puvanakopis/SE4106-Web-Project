const express = require("express");
const router = express.Router();
const { createTransport, getTransports, getTransport, getTransportsByOwner, updateTransport, deleteTransport, updateTransportRating, deleteTransportImage,
    updateTransportAvailability,
    updateTransportStatus,
    toggleTransportAvailability,
    getTransportStats
} = require("../controllers/transportController");

router.use('/uploads/transports', express.static('uploads/transports'));

// Transport routes
router.post("/", createTransport);
router.get("/", getTransports);
router.get("/:id", getTransport);
router.get("/owner/:owner_id", getTransportsByOwner);
router.put("/:id", updateTransport);
router.delete("/:id", deleteTransport);
router.get("/stats", getTransportStats);

// Rating and image management
router.patch("/:id/rating", updateTransportRating);
router.delete("/:id/images/:imageIndex", deleteTransportImage);

// Availability and Status management
router.patch("/:id/availability", updateTransportAvailability);
router.patch("/:id/availability/toggle", toggleTransportAvailability);
router.patch("/:id/status", updateTransportStatus);

module.exports = router;