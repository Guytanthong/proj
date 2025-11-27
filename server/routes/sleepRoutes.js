const express = require("express");
const router = express.Router();
const Sleep = require("../models/Sleep");

// POST — add a new sleep record
// POST — create or update sleep for a given date
router.post("/", async (req, res) => {
  try {
    const { date, sleepTime, wakeTime, mood } = req.body;

    // Check if sleep record already exists for that date
    let existing = await Sleep.findOne({ date });

    if (existing) {
      // Update existing record
      existing.sleepTime = sleepTime;
      existing.wakeTime = wakeTime;
      existing.mood = mood;
      await existing.save();

      return res.json({
        message: "Updated existing sleep entry",
        updated: existing
      });
    }

    // Create new record
    const newEntry = new Sleep(req.body);
    await newEntry.save();

    res.json({
      message: "Created new sleep entry",
      created: newEntry
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — get all sleep records
router.get("/", async (req, res) => {
  try {
    const sleeps = await Sleep.find().sort({ date: 1 });
    res.json(sleeps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
