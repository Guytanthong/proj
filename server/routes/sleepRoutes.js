const express = require("express");
const router = express.Router();
const Sleep = require("../models/Sleep");

// POST — add a new sleep record
router.post("/", async (req, res) => {
  try {
    const { date, sleepTime, wakeTime } = req.body;

    if (!date || !sleepTime || !wakeTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // calculate sleep duration
    const sleepDate = new Date(`${date}T${sleepTime}`);
    const wakeDate = new Date(`${date}T${wakeTime}`);
    let durationHours = (wakeDate - sleepDate) / (1000 * 60 * 60);

    // if wake time is next day
    if (durationHours < 0) durationHours += 24;

    const newSleep = new Sleep({
      date,
      sleepTime,
      wakeTime,
      durationHours,
    });

    await newSleep.save();
    res.status(201).json(newSleep);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving sleep data" });
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
