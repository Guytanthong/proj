const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  date: { type: Date, required: true }, // the day the mood is for
  mood: { type: String, enum: ["GOOD", "MEH", "BAD"], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mood", moodSchema);