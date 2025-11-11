const express = require("express");
const router = express.Router();
const { createTransport, getTransports, getTransport, getTransportsByOwner, updateTransport, deleteTransport, updateTransportRating, deleteTransportImage, updateTransportAvailability, updateTransportStatus, toggleTransportAvailability, getTransportStats} = require("../controllers/transportController");

router.use('/uploads/transports', express.static('uploads/transports'));

router.post("/", createTransport); 
router.get("/", getTransports); 

router.get("/:id", getTransport);
router.put("/:id", updateTransport); 
router.delete("/:id", deleteTransport); 
router.patch("/:id/rating", updateTransportRating);
router.delete("/:id/images/:imageIndex", deleteTransportImage);
router.patch("/:id/availability", updateTransportAvailability);
router.patch("/:id/availability/toggle", toggleTransportAvailability); 
router.patch("/:id/status", updateTransportStatus); 

router.get("/stats", getTransportStats);
router.get("/owner/:owner_id", getTransportsByOwner);

module.exports = router;