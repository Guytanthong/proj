const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  date: { type: String, required: true },    // "YYYY-MM-DD"
  title: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  color: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);