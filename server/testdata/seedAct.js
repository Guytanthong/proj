const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  uid: String,
  title: String,
  color: String
});

const Activity = mongoose.model("Activity", ActivitySchema);

const UID = "CEZwjlzMDARjvYwSfTfxnJbjwtW2";

const activities = [
  { title: "Morning Coffee", color: "#FFB703" },
  { title: "Breakfast", color: "#FACC15" },
  { title: "Study", color: "#38BDF8" },
  { title: "Coding", color: "#6366F1" },
  { title: "Workout", color: "#22C55E" },
  { title: "Training", color: "#4ADE80" },
  { title: "Meeting", color: "#FB923C" },
  { title: "Routine Task", color: "#A78BFA" },
  { title: "Social Media", color: "#F87171" },
  { title: "Relax", color: "#CBD5E1" }
];

async function seed() {
  await mongoose.connect("mongodb+srv://guy_db_user:Guywhoa292@cluster0.ohivkzt.mongodb.net/habittracker?retryWrites=true&w=majority");

  const docs = activities.map(a => ({
    uid: UID,
    ...a
  }));

  await Activity.insertMany(docs);
  console.log("Activities inserted 🎯");
  process.exit();
}

seed();