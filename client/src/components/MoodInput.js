import { useState } from "react";
import axios from "axios";

function MoodInput() {
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");

  const submitMood = async () => {
    if (!date || !mood) {
      alert("Please choose a date and mood!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/mood", {
        date,
        mood
      });
      alert("Mood saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save mood.");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Mood Gauge</h3>

      <label>Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <label>How was your day?</label>
      <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
        <button onClick={() => setMood("GOOD")}>😊 Good</button>
        <button onClick={() => setMood("MEH")}>😐 OK</button>
        <button onClick={() => setMood("BAD")}>😞 Bad</button>
      </div>

      <button onClick={submitMood}>Save Mood</button>
    </div>
  );
}

export default MoodInput;