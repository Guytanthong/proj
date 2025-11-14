import React, { useEffect, useState } from "react";
import axios from "axios";
import SleepTracker from "./components/sleepTracker";
import SleepChart from "./components/sleepChart";
import MoodInput from "./components/MoodInput";

function App() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch habits when page loads
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/habits");
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addHabit = async () => {
    if (!title) return;
    try {
      await axios.post("http://localhost:5000/api/habits", { title });
      setTitle("");
      fetchHabits(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const incrementStreak = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/habits/${id}`);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", textAlign: "center" }}>

      {/* Habit Tracker Section
      <h1>My Habits</h1>
      <div>
        <input
          type="text"
          placeholder="New habit..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addHabit}>Add</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {habits.map((habit) => (
          <li key={habit._id} style={{ margin: "10px 0" }}>
            <b>{habit.title}</b> — {habit.streak} days
            <button
              onClick={() => incrementStreak(habit._id)}
              style={{ marginLeft: "10px" }}
            >
              +1
            </button>
          </li>
        ))}
      </ul> */}


      {/*Sleep Tracker  */}
      <SleepTracker />

      {/* SleepChart */}
      <SleepChart />
      
      {/* MoodInput */}
      <MoodInput />
    </div>
  );
}

export default App;
