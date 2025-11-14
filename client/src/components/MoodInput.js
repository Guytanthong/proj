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
    <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.5)] text-white">
  <h2 className="text-2xl font-bold mb-4">Add ur ACT <span className="text-sm opacity-80">when the day is done</span></h2>

  {/* Date */}
  <label className="text-sm opacity-80">DATE</label>
  <input type="date"
    value={date}
    onChange={(e)=>setDate(e.target.value)}
    className="w-full mt-1 mb-4 bg-white/20 p-2 rounded-lg text-white" />

  {/* Mood Buttons */}
  <label className="text-sm opacity-80">MOOD</label>

  <div className="flex gap-2 mt-2 mb-4">
    <button onClick={()=>setMood("GOOD")} className="bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30">😊 GOOD</button>
    <button onClick={()=>setMood("MEH")} className="bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30">😐 MEH</button>
    <button onClick={()=>setMood("BAD")} className="bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30">😞 BAD</button>
  </div>

  <button onClick={submitMood}
      className="w-full bg-white/30 hover:bg-white/40 p-2 rounded-lg font-semibold">
    Save Mood
  </button>
</div>
  );
}

export default MoodInput;