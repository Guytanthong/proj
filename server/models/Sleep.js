const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  date: { type: Date, required: true },
  sleepTime: { type: String, required: true },
  wakeTime: { type: String, required: true },
  durationHours: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

sleepSchema.index({ uid: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Sleep', sleepSchema);
