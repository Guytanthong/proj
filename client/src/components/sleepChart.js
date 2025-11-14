import React, { useEffect, useState } from "react";
import axios from "axios";

function SleepRangeGraph() {
  const [sleepData, setSleepData] = useState([]);
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  // Fetch sleep + mood entries
  const loadAllData = async () => {
    const sleepRes = await axios.get("http://localhost:5000/api/sleep");
    const moodRes = await axios.get("http://localhost:5000/api/mood");

    setSleepData(sleepRes.data);
    setMoodData(moodRes.data);
  };

  /** Build a mood map for fast lookup **/
  const moodMap = {};
  moodData.forEach((m) => {
    const key = m.date.split("T")[0]; // format YYYY-MM-DD
    moodMap[key] = m.mood;            // GOOD / OK / BAD
  });

  const graphHeight = 500;

  const hourToY = (h) => (h / 24) * graphHeight;

  const moodColor = (mood) => {
    if (mood === "GOOD") return "green";
    if (mood === "MEH") return "orange";
    if (mood === "BAD") return "red";
    return "#C0C0C0"; // missing → grey
  };

  /** Format sleep entries with calculated colors **/
  const formatted = sleepData.map((entry, i) => {
    const sleepDate = new Date(entry.date);
    
    // Find next day (sleepDate + 1)
    const nextDay = new Date(sleepDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const nextDayKey = nextDay.toISOString().split("T")[0];

    const moodForNextDay = moodMap[nextDayKey] || "NONE";

    const [sh, sm] = entry.sleepTime.split(":").map(Number);
    const [wh, wm] = entry.wakeTime.split(":").map(Number);

    return {
      ...entry,
      x: 120 + i * 120,
      sleepHour: sh + sm / 60,
      wakeHour: wh + wm / 60,
      mood: moodForNextDay,
    };
  });

  return (
    <div
      style={{
        width: "900px",
        height: "600px",
        overflow: "auto",
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <svg width={formatted.length * 200} height={graphHeight + 100}>
      
        {/* Time axis on left */}
        {[0, 3, 6, 9, 12, 15, 18, 21].map((t) => (
          <text key={t} x="20" y={hourToY(t)} fontSize="12" fill="#666">
            {t}:00
          </text>
        ))}

        {/* Sleep bars */}
        {formatted.map((entry) => (
          <line
            key={entry._id}
            x1={entry.x}
            y1={hourToY(entry.sleepHour)}
            x2={entry.x}
            y2={hourToY(entry.wakeHour)}
            stroke={moodColor(entry.mood)}
            strokeWidth="12"
            strokeLinecap="round"
          />
        ))}

        {/* Date labels under bars */}
        {formatted.map((entry) => (
          <text
            key={entry._id + "-date"}
            x={entry.x - 30}
            y={graphHeight + 40}
            fontSize="12"
            fill="#444"
          >
            {new Date(entry.date).toLocaleDateString("en-UK", {
              day: "2-digit",
              month: "short",
            })}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default SleepRangeGraph;