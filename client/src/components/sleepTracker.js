import { useState } from "react";
import axios from "axios";

function SleepTracker() {
  const [date, setDate] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");

  const handleSubmit = async () => {
    if (!date || !sleepTime || !wakeTime) {
      alert("Please fill all fields!");
      return;
    }

    // Combine the selected date with times
    const sleepDateTime = new Date(`${date}T${sleepTime}`);
    let wakeDateTime = new Date(`${date}T${wakeTime}`);

    // If wake time is earlier than sleep time (past midnight case)
    if (wakeDateTime < sleepDateTime) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1);
    }

    try {
      await axios.post(`http://localhost:5000/api/sleep`, {
        date,
        sleepTime,
        wakeTime,
      });
      alert("Sleep data saved!");
    } catch (error) {
      console.error("Error saving sleep data:", error);
      alert("Failed to save sleep data");
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-600 to-yellow-700 p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.5)] text-white">
      <h2 className="text-2xl font-bold mb-4">Add ur SLEEP <span className="text-sm opacity-80">when u wake</span></h2>

          {/* date */}
      <label className="text-sm opacity-80">DATE</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full mt-1 mb-3 bg-white/20 p-2 rounded-lg text-white"
      />

      {/* sleep */}
      <label className="text-sm opacity-80">SLEEP</label>
      <input
        type="time"
        className="w-full mt-1 mb-3 bg-white/20 p-2 rounded-lg text-white"
        value={sleepTime}
        onChange={(e) => setSleepTime(e.target.value)}
      />

      {/* wake */}
      <label className="text-sm opacity-80">WAKE</label>
      <input
        type="time"
        className="w-full mt-1 mb-4 bg-white/20 p-2 rounded-lg text-white"
        value={wakeTime}
        onChange={(e) => setWakeTime(e.target.value)}
      />

      <button onClick={handleSubmit}
            className="mt-2 w-full bg-white/30 hover:bg-white/40 p-2 rounded-lg font-semibold">
        Save
      </button>
    </div>
  );
}

export default SleepTracker;
