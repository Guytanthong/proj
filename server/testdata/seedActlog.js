const mongoose = require("mongoose");

const Activity = mongoose.model(
  "Activity",
  new mongoose.Schema({
    uid: String,
    title: String,
    color: String
  })
);

const ActivityLog = mongoose.model(
  "ActivityLog",
  new mongoose.Schema({
    uid: String,
    title: String,
    start: String,
    end: String,
    date: Date,
    color: String
  })
);

const UID = "CEZwjlzMDARjvYwSfTfxnJbjwtW2";

function pad(n) {
  return n.toString().padStart(2, "0");
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  await mongoose.connect("mongodb+srv://guy_db_user:Guywhoa292@cluster0.ohivkzt.mongodb.net/habittracker?retryWrites=true&w=majority");

  const activities = await Activity.find({ uid: UID });

  if (!activities.length) {
    console.log("No activities found. Run seedActivities first!");
    process.exit();
  }

  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  start.setHours(0, 0, 0, 0);

  const logs = [];

  for (let i = 0; i < 365; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);

    const numActivities = randomBetween(2, 4); // 2–4 per day
    let currentHour = randomBetween(6, 10);    // start morning
    for (let j = 0; j < numActivities; j++) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      const duration = randomBetween(1, 3);

      const startTime = `${pad(currentHour)}:00`;
      const endTime = `${pad(currentHour + duration)}:00`;

      logs.push({
        uid: UID,
        title: activity.title,
        start: startTime,
        end: endTime,
        date: day,
        color: activity.color
      });

      currentHour += duration + randomBetween(0, 2); // gap between tasks
    }
  }

  await ActivityLog.insertMany(logs);
  console.log("1 Year Activity Logs Inserted 🎉");
  process.exit();
}

seed();
