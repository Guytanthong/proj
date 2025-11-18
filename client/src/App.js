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
  

  // NEW: Shared date range for both graphs
  const [sharedRange, setSharedRange] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/sleep").then(res => setSleepData(res.data));
    axios.get("http://localhost:5000/api/mood").then(res => setMoodData(res.data));
    axios.get("http://localhost:5000/api/activity/all").then(res => setActivityData(res.data));
  }, []);

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

          <SleepGraph
            sleepData={sleepData}
            moodData={moodData}
            onRangeChange={setSharedRange}
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
