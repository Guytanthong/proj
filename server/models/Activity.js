const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },     // e.g. "Coffee", "Gaming"
  start: { type: String, required: true },     // "HH:MM"
  end: { type: String, required: true },       // "HH:MM"
  date: { type: String, required: true },      // "YYYY-MM-DD"
  color: { type: String, default: "#3b82f6" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", ActivitySchema);