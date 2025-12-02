import { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

function SleepTracker() {
  const [date, setDate] = useState("");
  const [sleepTime, setSleepTime] = useState("");   // now a string "HH:mm"
  const [wakeTime, setWakeTime] = useState("");     // string "HH:mm"

  function getUID() {
    return auth.currentUser?.uid || null;
  }
  // Ensure "H:M" → "HH:MM"
  function formatTime(str) {
    if (!str) return "";
    const [h, m] = str.split(":").map(Number);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  const handleSubmit = async () => {
    if (!date || !sleepTime || !wakeTime) {
      alert("Please fill all fields!");
      return;
    }

    const uid = getUID();
    if (!uid) return alert("You must be logged in!");

    const sleepString = formatTime(sleepTime);
    const wakeString = formatTime(wakeTime);

    const sleepDateTime = new Date(`${date}T${sleepString}`);
    let wakeDateTime = new Date(`${date}T${wakeString}`);

    // If waking is earlier → next day
    if (wakeDateTime < sleepDateTime) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1);
    }

    try {
      await axios.post("https://proj-lmfu.onrender.com/api/sleep", {
        uid,
        date,
        sleepTime: sleepString,
        wakeTime: wakeString
      });

      alert("Sleep data saved!");
    } catch (error) {
      console.error("Error saving sleep data:", error);
      alert("Failed to save sleep data");
    }
  };

  return (
    <div className= "card card-sleep">

      <h2 className="text-2xl font-bold mb-4">
        Add your SLEEP <span className="text-sm opacity-80">when u wake</span>
      </h2>

      {/* DATE */}
      <label className="text-sm opacity-80">DATE</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full mt-1 mb-3 bg-white/20 p-2 rounded-lg text-white"
      />

      {/* Sleep Time */}
      <label className="text-sm opacity-80">Sleep Time</label>
      <input
        type="time"
        value={sleepTime}
        onChange={(e) => setSleepTime(e.target.value)}
        className="w-full mt-1 mb-3 bg-white/20 p-2 rounded-lg text-white"
      />

      {/* Wake Time */}
      <label className="text-sm opacity-80">Wake Time</label>
      <input
        type="time"
        value={wakeTime}
        onChange={(e) => setWakeTime(e.target.value)}
        className="w-full mt-1 mb-3 bg-white/20 p-2 rounded-lg text-white"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-white/30 hover:bg-white/40 p-2 rounded-lg font-semibold"
      >
        Save
      </button>

    </div>
  );
}

export default SleepTracker;
