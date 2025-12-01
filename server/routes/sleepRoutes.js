const express = require("express");
const router = express.Router();
const Sleep = require("../models/Sleep");

//
// POST — create or update sleep entry for this user
//
router.post("/", async (req, res) => {
  try {
    const { uid, date, sleepTime, wakeTime, mood } = req.body;

    if (!uid) return res.status(400).json({ error: "Missing UID" });
    if (!date) return res.status(400).json({ error: "Missing date" });

    // Find this user's entry for THAT date
    let existing = await Sleep.findOne({ uid, date });

    if (existing) {
      existing.sleepTime = sleepTime;
      existing.wakeTime = wakeTime;
      existing.mood = mood;
      await existing.save();

      return res.json({
        message: "Updated existing sleep entry",
        updated: existing
      });
    }

    // Create new entry
    const newEntry = new Sleep({
      uid,
      date,
      sleepTime,
      wakeTime,
      mood
    });

    await newEntry.save();

    return res.json({
      message: "Created new sleep entry",
      created: newEntry
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


//
// GET — only return THIS user's sleep records
//
router.get("/", async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) return res.status(400).json({ error: "Missing UID" });

    const sleeps = await Sleep.find({ uid }).sort({ date: 1 });

    res.json(sleeps);
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
