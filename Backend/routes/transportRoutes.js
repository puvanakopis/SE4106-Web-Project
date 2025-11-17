const express = require("express");
const router = express.Router();
const { createTransport,
    getTransports,
    getTransport,
    updateTransport,
    deleteTransport,
    updateTransportStatus,
    getTransportsByOwner,
} = require("../controllers/transportController");

router.use('/uploads/transports', express.static('uploads/transports'));

router.post("/", createTransport);
router.get("/", getTransports);
router.get("/:id", getTransport);
router.put("/:id", updateTransport);
router.delete("/:id", deleteTransport);
router.patch("/:id/status", updateTransportStatus);
router.get("/owner/:owner_id", getTransportsByOwner);

module.exports = router;