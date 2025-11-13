const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  frequency: { type: String, default: 'daily' },
  streak: { type: Number, default: 0},
  lastCompleted: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }, 
  sleepTime: { type: Date },
  wakeTime: { type: Date }
});

module.exports = mongoose.model('Habit', habitSchema);
