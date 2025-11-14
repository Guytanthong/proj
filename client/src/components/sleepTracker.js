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
    <div style={{ marginTop: "20px" }}>
      <h3>Sleep Tracker</h3>

      <div style={{ marginBottom: "10px" }}>
        <label>Date:</label>
        <br />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Sleep Time:</label>
        <br />
        <input
          type="time"
          value={sleepTime}
          onChange={(e) => setSleepTime(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Wake Time:</label>
        <br />
        <input
          type="time"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

export default SleepTracker;
