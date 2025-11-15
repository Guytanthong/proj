import { useState } from "react";
import axios from "axios";
import CustomTimePicker from "./CustomTimePicker";

function SleepTracker() {
  const [date, setDate] = useState("");
  const [sleepTime, setSleepTime] = useState(null);
  const [wakeTime, setWakeTime] = useState(null);

  // Convert picker object → "HH:mm"
  function to24h({ hour, minute, ampm }) {
    let h = hour % 12;
    if (ampm === "PM") h += 12;
    return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  const handleSubmit = async () => {
    if (!date || !sleepTime || !wakeTime) {
      alert("Please fill all fields!");
      return;
    }

    // Convert picker values to time strings
    const sleepString = to24h(sleepTime);
    const wakeString = to24h(wakeTime);

    // Build Date objects
    const sleepDateTime = new Date(`${date}T${sleepString}`);
    let wakeDateTime = new Date(`${date}T${wakeString}`);

    if (wakeDateTime < sleepDateTime) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1);
    }

    try {
      await axios.post("http://localhost:5000/api/sleep", {
        date,
        sleepTime: sleepString,
        wakeTime: wakeString,
      });

      alert("Sleep data saved!");
    } catch (error) {
      console.error("Error saving sleep data:", error);
      alert("Failed to save sleep data");
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-600 to-yellow-700 p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.5)] text-white">

      <h2 className="text-2xl font-bold mb-4">
        Add ur SLEEP <span className="text-sm opacity-80">when u wake</span>
      </h2>

      {/* Date */}
      <label className="text-sm opacity-80">DATE</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full mt-1 mb-3 bg-white/20 p-2 rounded-lg text-white"
      />

      {/* Sleep Time Picker */}
      <label className="text-sm opacity-80">SLEEP</label>
      <CustomTimePicker
        label="Sleep Time"
        value={sleepTime}
        onChange={(val) => setSleepTime(val)}
      />

      {/* Wake Time Picker */}
      <label className="text-sm opacity-80 mt-2">WAKE</label>
      <CustomTimePicker
        label="Wake Time"
        value={wakeTime}
        onChange={(val) => setWakeTime(val)}
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
