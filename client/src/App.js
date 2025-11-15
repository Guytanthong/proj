import React, { useEffect, useState } from "react";
import axios from "axios";
import SleepTracker from "./components/sleepTracker";
import ZoomSleepChart from "./components/ZoomSleepChart";
import MoodInput from "./components/MoodInput";
import Header from "./components/Header";

function App() {

  const [sleepData, setSleepData] = useState([]);
  const [moodData, setMoodData] = useState([]);

  //fetch the sleepData when app loads
  useEffect(() => {
  axios.get("http://localhost:5000/api/sleep")
    .then(res => setSleepData(res.data))
    .catch(err => console.error(err));
  }, []);

  useEffect(() => {
  axios.get("http://localhost:5000/api/mood")
    .then(res => setMoodData(res.data))
    .catch(err => console.error(err));
}, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed pt-20"
      style={{ backgroundImage: "url('/star-bg.jpg')" }}
    >
      <Header />

      <div className="max-w-[1500px] mx-auto flex gap-10 p-10">
        {/* LEFT SIDE */}
        <div className="w-[340px] flex flex-col gap-8">
          <SleepTracker />
          <MoodInput />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">
          {/* <SleepChart />  Old graph no zoom */}

          <ZoomSleepChart sleepData={sleepData}  moodData={moodData}  />
        </div>
      </div>
    </div>
    
  );
}

export default App;
