const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },   // e.g. "Study"
  start: { type: String, required: true },   // "HH:MM"
  end: { type: String, required: true },     // "HH:MM"
  color: { type: String, default: "#3b82f6" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", ActivitySchema);
