import React, { useEffect, useState } from "react";
import axios from "axios";
import SleepTracker from "./components/sleepTracker";
import SleepGraph from "./components/SleepGraph";
import Header from "./components/Header";
import ActInput from "./components/ActInput";
import ActivityGraph from "./components/ActivityGraph";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";



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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      setSleepData([]);
      setMoodData([]);
      setActivityData([]);


      const uid = user.uid;

      axios.get("http://localhost:5000/api/sleep", { params: { uid } })
        .then(res => setSleepData(res.data));

      axios.get("http://localhost:5000/api/mood", { params: { uid } })
        .then(res => setMoodData(res.data));

      axios.get("http://localhost:5000/api/activity/logs", { params: { uid } })
        .then(res => setActivityData(res.data));
    });

    return () => unsubscribe();
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

  <Routes>

    {/* LOGIN PAGE */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* MAIN DASHBOARD */}
    <Route
      path="/"
      element={
      <ProtectedRoute>
          <div className="min-h-screen bg-gray-950 bg-center bg-fixed pt-20">

            <Header />

            <div className="max-w-[1500px] ml-10 flex gap-10 p-10">
              <div className="w-[360px] flex flex-col gap-8 ">
                <SleepTracker />
                <ActInput />
              </div>

              <div className="flex-1 flex flex-col gap-5">
                <div className="relative w-[2000px] bg-[#0f172a] h-[530px] rounded-xl shadow-lg overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 z-20 
                                  flex items-center justify-between 
                                  px-4 py-2 bg-white/80 backdrop-blur-sm 
                                  border-b border-gray-200">

                    <div className="flex gap-2">
                      {["1W","1M","3M","6M","1Y","RESET"].map(preset => (
                        <button
                          key={preset}
                          onClick={() => {
                            setCurrentMonth("");
                            setRangePreset(preset);
                          }}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200
                                    text-gray-700 rounded-md shadow-sm
                                    text-sm font-medium"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => shiftMonth(-1)}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm">◀</button>

                      <input type="month"
                            value={currentMonth}
                            onChange={(e) => changeMonth(e.target.value)}
                            className="px-3 py-1 bg-gray-100 rounded-md text-gray-700 shadow-sm"/>

                      <button onClick={() => shiftMonth(1)}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm">▶</button>
                    </div>
                  </div>

                  <div className="pt-12">
                    <SleepGraph
                      sleepData={sleepData}
                      moodData={moodData}
                      sharedRange={sharedRange}
                    />
                  </div>
                </div>

                <ActivityGraph activityData={activityData} sharedRange={sharedRange} />
              </div>
            </div>

          </div>
        </ProtectedRoute>
      }
    />

  </Routes>
  );
}

export default App;
