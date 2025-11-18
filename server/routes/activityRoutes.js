const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// CREATE activity for a day
router.post("/create", async (req, res) => {
  try {
    const { title, start, end, date } = req.body;

    if (!title || !start || !end || !date) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const activity = new Activity({ title, start, end, date });
    await activity.save();

    res.json({ message: "Activity saved", activity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all activities (for dropdown)
router.get("/all", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
