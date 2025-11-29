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


  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  
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
        setCurrentMonth("");   // ← EXIT MONTH MODE
        min = today - 6 * 24 * 60 * 60 * 1000; // last 30 days
        setSharedRange({ min, max: today });
        return;
    }

    setSharedRange({ min, max: today});
  }, [rangePreset, sleepData]);

  function shiftMonth(direction) {
    const [year, month] = currentMonth.split("-").map(Number);
    const d = new Date(year, month - 1 + direction, 1);

    const y = d.getFullYear();
    const m = d.getMonth() + 1;

    const newValue = `${y}-${String(m).padStart(2, "0")}`;
    setCurrentMonth(newValue);

    updateRange(newValue);
  }

  function changeMonth(value) {
    setCurrentMonth(value);
    updateRange(value);
  }

  function updateRange(ym) {
    const [year, month] = ym.split("-").map(Number);

    const firstDay = new Date(year, month - 1, 1).setHours(0, 0, 0, 0);
    const lastDay = new Date(year, month, 0).setHours(0, 0, 0, 0);

    setSharedRange({
      min: firstDay,
      max: lastDay
    });
  }

  return (
    <div className="min-h-screen bg-gray-950 bg-center bg-fixed pt-20">

      <Header />

      <div className="max-w-[1500px] ml-10 flex gap-10 p-10">

        {/* LEFT SIDE */}
        <div className="w-[360px] flex flex-col gap-8 ">
          <SleepTracker />
          <ActInput />
        </div>

        {/* RIGHT SIDE (STACKED GRAPHS) */}
        <div className="flex-1 flex flex-col gap-5">

          {/* SLEEP GRAPH BOX */}
          <div className="relative w-[2000px] bg-white h-[530px] rounded-xl shadow-lg overflow-hidden">

            {/* TOP CONTROLS */}
            <div className="absolute top-0 left-0 right-0 z-20 
                            flex items-center justify-between 
                            px-4 py-2 bg-white/80 backdrop-blur-sm 
                            border-b border-gray-200">

              {/* PRESET BUTTONS */}
              <div className="flex gap-2">
                {["1W","1M","3M","6M","1Y","RESET"].map(preset => (
                  <button
                    key={preset}
                    onClick={() => {
                      setCurrentMonth("");      //  exit “month mode”
                      setRangePreset(preset);   //  apply preset normally
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200
                              text-gray-700 rounded-md shadow-sm
                              text-sm font-medium"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* MONTH PICKER */}
              <div className="flex items-center gap-2">
                <button onClick={() => shiftMonth(-1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm">
                  ◀
                </button>

                <input type="month"
                      value={currentMonth}
                      onChange={(e) => changeMonth(e.target.value)}
                      className="px-3 py-1 bg-gray-100 rounded-md text-gray-700 shadow-sm"/>

                <button onClick={() => shiftMonth(1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm">
                  ▶
                </button>
              </div>
            </div>

            {/* GRAPH WITH OFFSET TO AVOID OVERLAP */}
            <div className="pt-12">
              <SleepGraph
                sleepData={sleepData}
                moodData={moodData}
                sharedRange={sharedRange}
              />
            </div>
          </div>

          {/* ACTIVITY GRAPH */}
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
