const express = require("express");
const router = express.Router();
const { createTransport, getTransports, getTransport, getTransportsByOwner, updateTransport, deleteTransport, updateTransportRating, deleteTransportImage } = require("../controllers/transportController");

router.use('/uploads/transports', express.static('uploads/transports'));

// Transport routes
router.post("/", createTransport);
router.get("/", getTransports);
router.get("/:id", getTransport);
router.get("/owner/:owner_id", getTransportsByOwner);
router.put("/:id", updateTransport);
router.delete("/:id", deleteTransport);

// Rating and image management
router.patch("/:id/rating", updateTransportRating);
router.delete("/:id/images/:imageIndex", deleteTransportImage);

module.exports = router;