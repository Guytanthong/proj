import React, { useEffect, useState } from "react";
import axios from "axios";
import SleepTracker from "./components/sleepTracker";
import SleepGraph from "./components/SleepGraph";
import Header from "./components/Header";
import ActInput from "./components/ActInput";
import ActivityGraph from "./components/ActivityGraph";

function App() {

  const [sleepData, setSleepData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [rangePreset, setRangePreset] = useState(null);
  

  // NEW: Shared date range for both graphs
  const [sharedRange, setSharedRange] = useState(null);

 useEffect(() => {
  axios.get("http://localhost:5000/api/sleep").then(res => setSleepData(res.data));
  axios.get("http://localhost:5000/api/mood").then(res => setMoodData(res.data));
  axios.get("http://localhost:5000/api/activity/logs").then(res => setActivityData(res.data));
}, []);

  // NEW: Auto-adjust X-axis when preset changes
  useEffect(() => {
    
    const today = new Date().setHours(0,0,0,0);


    if (!rangePreset) {
      setSharedRange({
      min: today - 6 * 24 * 60 * 60 * 1000, //last 7 days
      max: today
    });
    return;
  }
    let min;

    switch (rangePreset) {
      case "1W":
        min = today - 6 * 24 * 60 * 60 * 1000;
        break;
      case "1M":
        min = today - 29 * 24 * 60 * 60 * 1000;
        break;
      case "3M":
        min = today - 89 * 24 * 60 * 60 * 1000;
        break;
      case "6M":
        min = today - 179 * 24 * 60 * 60 * 1000;
        break;
      case "1Y":
        min = today - 364 * 24 * 60 * 60 * 1000;
        break;
      case "RESET":
        min = today - 6 * 24 * 60 * 60 * 1000; // last 30 days
        setSharedRange({ min, max: today });
        return;
    }

    setSharedRange({ min, max: today});
  }, [rangePreset, sleepData]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed pt-20"
      style={{ backgroundImage: "url('/star-bg.jpg')" }}>

      <Header />

      <div className="max-w-[1500px] mx-auto flex gap-10 p-10">

        {/* LEFT SIDE */}
        <div className="w-[340px] flex flex-col gap-8">
          <SleepTracker />
          <ActInput />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">

        <div className="flex gap-2 mb-4">
          {["1W", "1M", "3M", "6M", "1Y", "RESET"].map(preset => (
            <button
              key={preset}
              onClick={() => setRangePreset(preset)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded"
            >
              {preset}
            </button>
          ))}
        </div>

        
        
        <SleepGraph
          sleepData={sleepData}
          moodData={moodData}
          onRangeChange={setSharedRange}
          sharedRange={sharedRange} 
          
        />

        <ActivityGraph
          activityData={activityData}
          sharedRange={sharedRange}
        />

        </div>
      </div>

    </div>
  );
}

export default App;
