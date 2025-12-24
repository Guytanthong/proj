const mongoose = require("mongoose");

const SleepSchema = new mongoose.Schema({
  uid: String,
  date: Date,
  sleepTime: String,
  wakeTime: String,
  durationHours: Number
});

const MoodSchema = new mongoose.Schema({
  uid: String,
  date: Date,
  mood: String
});

const Sleep = mongoose.model("Sleep", SleepSchema);
const Mood = mongoose.model("Mood", MoodSchema);

const UID = "CEZwjlzMDARjvYwSfTfxnJbjwtW2";

function pad(n) {
  return n.toString().padStart(2, "0");
}

function randomMood() {
  const moods = ["GOOD", "MEH", "BAD"];
  return moods[Math.floor(Math.random() * moods.length)];
}

function formatTime(h, m) {
  return `${pad(h)}:${pad(m)}`;
}

async function seed() {
  await mongoose.connect("mongodb+srv://guy_db_user:Guywhoa292@cluster0.ohivkzt.mongodb.net/habittracker?retryWrites=true&w=majority");

  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  start.setHours(0, 0, 0, 0);

  const sleepData = [];
  const moodData = [];

  for (let i = 0; i < 365; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    // bedtime 22:00 – 01:00
    let sleepHour = 22 + Math.floor(Math.random() * 3);
    let sleepMin = Math.random() > 0.5 ? 0 : 30;

    // 6.2 – 8.8 hrs
    const duration = +(6.2 + Math.random() * 2.6).toFixed(1);

    const total = sleepHour * 60 + sleepMin + duration * 60;
    let wakeHour = Math.floor(total / 60) % 24;
    let wakeMin = Math.floor(total % 60);

    sleepData.push({
      uid: UID,
      date,
      sleepTime: formatTime(sleepHour, sleepMin),
      wakeTime: formatTime(wakeHour, wakeMin),
      durationHours: duration
    });

    moodData.push({
      uid: UID,
      date,
      mood: randomMood()
    });
  }

  await Sleep.insertMany(sleepData);
  await Mood.insertMany(moodData);

  console.log("Inserted sleep + mood data for 1 year 🎉");
  process.exit();
}

seed();