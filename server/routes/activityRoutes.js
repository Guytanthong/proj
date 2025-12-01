const express = require("express");
const router = express.Router();

const Activity = require("../models/Activity");      
const ActivityLog = require("../models/ActivityLog");

//
//  CREATE ROUTINE TEMPLATE  (/create)
//
router.post("/create", async (req, res) => {
  try {
    const { uid, title, start, end, color } = req.body;

    if (!uid) return res.status(400).json({ error: "Missing UID" });
    if (!title || !start || !end || !color) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const tpl = await Activity.create({
      uid,
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
//  GET ALL TEMPLATES for this user (/all)
//
router.get("/all", async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "Missing UID" });

    const templates = await Activity
      .find({ uid })
      .sort({ createdAt: -1 });

    return res.json(templates);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


//
//  LOG ACTIVITY (/log)
//
router.post("/log", async (req, res) => {
  

  try {
    const { uid, date, activityId, title, start, end, color } = req.body;

    if (!uid) return res.status(400).json({ error: "Missing UID" });
    if (!date) return res.status(400).json({ error: "Missing date" });

    // Case 1: template-based
    if (activityId) {
      const tpl = await Activity.findOne({ _id: activityId, uid });
      if (!tpl) return res.status(404).json({ error: "Template not found or unauthorized" });

      const log = await ActivityLog.create({
        uid,
        date,
        title: tpl.title,
        start: tpl.start,
        end: tpl.end,
        color: tpl.color,
      });

      return res.json(log);
    }

    // Case 2: custom activity
    if (!title || !start || !end || !color) {
      return res.status(400).json({ error: "Missing custom log fields" });
    }

    const log = await ActivityLog.create({
      uid,
      date,
      title,
      start,
      end,
      color,
    });

    return res.json(log);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


//
//  GET ALL LOGGED ACTIVITIES for this user (/logs)
//
router.get("/logs", async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "Missing UID" });

    const logs = await ActivityLog
      .find({ uid })
      .sort({ date: 1 });

    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


module.exports = router;
