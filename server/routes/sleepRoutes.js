const express = require("express");
const router = express.Router();
const Sleep = require("../models/Sleep");

//
// POST — create or update sleep entry for this user
//
router.post("/", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);
    const { uid, date, sleepTime, wakeTime } = req.body;

    if (!uid) return res.status(400).json({ message: "Missing UID" });
    if (!date) return res.status(400).json({ message: "Missing date" });

    //Normalize date (VERY IMPORTANT)
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0,0,0,0);

    const sleep = await Sleep.findOneAndUpdate(
      { uid, date: normalizedDate },
      { uid, date: normalizedDate, sleepTime, wakeTime },
      { upsert: true, new: true }
    );
    
    res.status(200).json(sleep);
    
  } catch (err) {
    res.status(400).json({ message: err.message });
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
