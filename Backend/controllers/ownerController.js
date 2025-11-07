const Owner = require("../models/ownerModel");


const createOwner = async (req, res) => {
  try {
    const owner = new Owner(req.body);
    await owner.save();
    res.status(201).json({ success: true, owner });
  } catch (error) {
    console.error("Create owner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getOwners = async (req, res) => {
  try {
    const owners = await Owner.find();
    res.json({ success: true, owners });
  } catch (error) {
    console.error("Get owners error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getOwner = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({ success: false, message: "Owner not found" });
    res.json({ success: true, owner });
  } catch (error) {
    console.error("Get owner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!owner) return res.status(404).json({ success: false, message: "Owner not found" });
    res.json({ success: true, owner });
  } catch (error) {
    console.error("Update owner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndDelete(req.params.id);
    if (!owner) return res.status(404).json({ success: false, message: "Owner not found" });
    res.json({ success: true, message: "Owner deleted successfully" });
  } catch (error) {
    console.error("Delete owner error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createOwner,
  getOwners,
  getOwner,
  updateOwner,
  deleteOwner
};
