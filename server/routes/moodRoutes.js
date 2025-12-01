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
    if (!date || !mood) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const entry = new Mood({
      uid,
      date,
      mood
    });

    await entry.save();
    res.status(201).json(entry);

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
