const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");

// Add mood
router.post("/", async (req, res) => {
  try {
    const { date, mood } = req.body;
    const entry = new Mood({ date, mood });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all moods
router.get("/", async (req, res) => {
  const moods = await Mood.find().sort({ date: 1 });
  res.json(moods);
});

module.exports = router;