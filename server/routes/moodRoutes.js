const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");

//
// ADD mood (user-specific)
//
router.post("/", async (req, res) => {
  try {
    const { uid, date, mood } = req.body;

    if (!uid) return res.status(400).json({ message: "Missing UID" });
    if (!date || !mood) return res.status(400).json({ message: "Missing fields" });

    // 🔥 Normalize date (VERY IMPORTANT)
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0,0,0,0);

    // 🔍 Check if mood already exists for that day
    let existing = await Mood.findOne({ uid, date: normalizedDate });

    if (existing) {
      existing.mood = mood;
      await existing.save();

      return res.json({
        message: "Updated existing mood entry",
        updated: existing
      });
    }

    // 🆕 Create new entry
    const entry = new Mood({
      uid,
      date: normalizedDate,
      mood
    });

    await entry.save();
    res.status(201).json({
      message: "Created new mood entry",
      created: entry
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//
// GET moods for THIS USER only
//
router.get("/", async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) return res.status(400).json({ message: "Missing UID" });

    const moods = await Mood.find({ uid }).sort({ date: 1 });

    res.json(moods);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
