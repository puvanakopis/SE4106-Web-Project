const express = require("express");
const router = express.Router();
const {
  createAccommodation,
  getAccommodations,
  getAccommodation,
  updateAccommodation,
  deleteAccommodation,
  updateAccommodationStatus,
  getAccommodationsByOwner
} = require("../controllers/accommodationController");

router.use('/uploads/accommodations', express.static('uploads/accommodations'));

router.post("/", createAccommodation);
router.get("/", getAccommodations);
router.get("/:id", getAccommodation);
router.put("/:id", updateAccommodation);
router.delete("/:id", deleteAccommodation);
router.patch("/:id/status", updateAccommodationStatus);
router.get("/owner/:owner_id", getAccommodationsByOwner);

module.exports = router;