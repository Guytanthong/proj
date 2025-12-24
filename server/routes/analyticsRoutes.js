const express = require("express");
const router = express.Router();

const Sleep = require("../models/Sleep");
const Mood = require("../models/Mood");
const ActivityLog = require("../models/ActivityLog");


// =============================
//  SAFE DURATION CALCULATOR
// =============================
function calcDuration(s) {
  if (s.durationHours) return Number(s.durationHours);

  if (!s.sleepTime || !s.wakeTime) return 0;

  const sleep = new Date(`2000-01-01T${s.sleepTime}`);
  const wake = new Date(`2000-01-02T${s.wakeTime}`);

  return Number(((wake - sleep) / (1000 * 60 * 60)).toFixed(1));
}


// =============================
//  MAIN ANALYTICS ENDPOINT
// =============================
router.get("/", async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "Missing UID" });

    const response = {};

    // ==================================================
    // ******************** SLEEP ***********************
    // ==================================================
    const sleeps = await Sleep.find({ uid }).sort({ date: 1 });

    if (sleeps.length > 0) {

      // ---- Average + Consistency ----
      let total = 0;
      let deviations = [];

      sleeps.forEach(s => total += calcDuration(s));
      const avgSleep = total / sleeps.length;
      const mean = avgSleep;

      sleeps.forEach(s => deviations.push(Math.abs(calcDuration(s) - mean)));

      const consistency =
        100 - (deviations.reduce((a, b) => a + b, 0) / sleeps.length * 10);


      // ---- Last 30 Day Sleep History ----
      const last30 = sleeps.slice(-30);

      const history = last30.map(s => ({
        date: new Date(s.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }),
        hours: calcDuration(s)
      }));


      response.sleep = {
        avgHours: Number(avgSleep.toFixed(2)),
        consistency: Math.max(0, Math.min(100, Number(consistency.toFixed(1)))),
        daysTracked: sleeps.length,
        history
      };
    }



    // ==================================================
    // ******************** MOOD ************************
    // ==================================================
    const moods = await Mood.find({ uid });

    if (moods.length > 0) {
      const moodCounts = { GOOD: 0, MEH: 0, BAD: 0 };

      moods.forEach(m => moodCounts[m.mood]++);

      response.mood = {
        total: moods.length,
        breakdown: moodCounts
      };
    }



    // ==================================================
    // ***************** ACTIVITY ***********************
    // ==================================================
    const logs = await ActivityLog.find({ uid });

    if (logs.length > 0) {
      let productHours = 0;
      let relaxHours = 0;

      logs.forEach(l => {
        const start = Number(l.start.split(":")[0]);
        const end = Number(l.end.split(":")[0]);
        const duration = end - start;

        if (["Study","Coding","Workout","Training","Meeting"].includes(l.title))
          productHours += duration;
        else
          relaxHours += duration;
      });

      const total = productHours + relaxHours;

      response.activity = {
        productivePercent: total ? Math.round(productHours / total * 100) : 0,
        relaxPercent: total ? Math.round(relaxHours / total * 100) : 0
      };
    }


    // ================================
    // RETURN RESPONSE
    // ================================
    res.json(response);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
