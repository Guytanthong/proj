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

    // date is already YYYY-MM-DD string → DO NOT convert

    let existing = await Mood.findOne({ uid, date });

    if (existing) {
      existing.mood = mood;
      await existing.save();

      return res.json({
        message: "Updated existing mood entry",
        updated: existing
      });
    }

    const entry = new Mood({ uid, date, mood });
    await entry.save();

    res.status(201).json({
      message: "Created new mood entry",
      created: entry
    });

  } catch (err) {
    console.log(err); // ⭐ keep this for debugging
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
