const express = require("express");
const router = express.Router();
const { createOwner, getOwners, getOwner, updateOwner, deleteOwner } = require("../controllers/ownerController");

router.use('/uploads', express.static('uploads'));

router.post("/", createOwner);
router.get("/", getOwners);
router.get("/:id", getOwner);
router.put("/:id", updateOwner);
router.delete("/:id", deleteOwner);

module.exports = router;