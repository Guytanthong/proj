const express = require("express");
const router = express.Router();

const Activity = require("../models/Activity");      // Routine templates
const ActivityLog = require("../models/ActivityLog"); // Daily logs

console.log("🔥 activityRoutes.js LOADED");


// 
//  CREATE ROUTINE TEMPLATE  (/create)
// 
router.post("/create", async (req, res) => {
  console.log("🔥 CREATE REQUEST BODY:", req.body);

  try {
    const { title, start, end, color } = req.body;

    if (!title || !start || !end || !color) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const tpl = await Activity.create({
      title,
      start,
      end,
      color,
    });

    return res.json(tpl);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// 
//  GET ALL TEMPLATES (/all)
// 
router.get("/all", async (req, res) => {
  try {
    const templates = await Activity.find().sort({ createdAt: -1 });
    return res.json(templates);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// 
//  LOG ACTIVITY FOR DAY  (/log)
//  Supports template-based + custom
// 
router.post("/log", async (req, res) => {
  console.log("🔥 LOG REQUEST BODY:", req.body);

  try {
    const { date, activityId, title, start, end, color } = req.body;

    if (!date)
      return res.status(400).json({ error: "Missing date" });

    // Case 1: using routine template
    if (activityId) {
      const tpl = await Activity.findById(activityId);
      if (!tpl) return res.status(404).json({ error: "Template not found" });

      const log = await ActivityLog.create({
        date,
        title: tpl.title,
        start: tpl.start,
        end: tpl.end,
        color: tpl.color
      });

      return res.json(log);
    }

    // Case 2: custom log (not a routine)
    if (!title || !start || !end || !color) {
      return res.status(400).json({ error: "Missing custom log fields" });
    }

    const log = await ActivityLog.create({
      date,
      title,
      start,
      end,
      color
    });

    return res.json(log);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// 
//  GET ALL LOGGED ACTIVITIES FOR GRAPH (/logs)
//
router.get("/logs", async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ date: 1 });
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


module.exports = router;
