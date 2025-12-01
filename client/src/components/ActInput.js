import { useState, useEffect } from "react";
import axios from "axios";
import TimeInput24 from "./TimeInput24";
import { auth } from "../firebase";

export default function ActInput() {
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");
  const [newColor, setNewColor] = useState("#3b82f6");

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [saveAsRoutine, setSaveAsRoutine] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  function getUID() {
    return auth.currentUser?.uid || null;
  }
  // Load activity templates
  useEffect(() => {
    async function load() {
      const res = await axios.get("http://localhost:5000/api/activity/all", {params: { uid: getUID() }});
      setActivities(res.data);
    }
    load();
  }, []);

  // Convert "HH:mm" directly (TimeInput24 already returns correct format)
  function to24h(str) {
    return str;
  }

  /* 
     HANDLE SAVE (MOOD + ACTIVITY LOGGING)
  */
  async function handleSave() {
    if (!date) return alert("Please choose a date!");
    if (!mood && !selectedActivity)
      return alert("Select at least MOOD or ACTIVITY.");

    const uid = getUID();
    if (!uid) return alert("You must be logged in!");

    // Save mood
    if (mood) {
      await axios.post("http://localhost:5000/api/mood", {
        uid,
        date,
        mood,
      });
    }

    // Log activity using template
    if (selectedActivity) {
      await axios.post("http://localhost:5000/api/activity/log", {
        uid,
        date,
        activityId: selectedActivity
      });
    }

    alert("Saved!");
  }


  /*
     SAVE NEW TEMPLATE ACTIVITY
   */
  async function saveNewActivity() {
    if (!date) return alert("Select a date before adding activity!");
    if (!newTitle || !startTime || !endTime)
      return alert("Fill all Activity fields!");

    const uid = getUID();
    if (!uid) return alert("You must be logged in!");

    const start24 = to24h(startTime);
    const end24 = to24h(endTime);

    // 1. Log daily activity (ALWAYS)
    await axios.post("http://localhost:5000/api/activity/log", {
      uid,
      date,
      title: newTitle,
      start: start24,
      end: end24,
      color: newColor,
    });

    // 2. Save as routine ONLY IF CHECKED
    if (saveAsRoutine) {
      await axios.post("http://localhost:5000/api/activity/create", {
        uid,
        title: newTitle,
        start: start24,
        end: end24,
        color: newColor,
      });
    }

    alert("Activity Added!");

    // Reset modal fields
    setModalOpen(false);
    setNewTitle("");
    setStartTime("");
    setEndTime("");
    setSaveAsRoutine(false);

    // Reload routines
    const res = await axios.get("http://localhost:5000/api/activity/all", {
      params: { uid }
    });
    setActivities(res.data);
  }


  return (
    <>
      <div className= "card card-act" >
        <h2 className="text-2xl font-bold mb-4">
          Add ur ACT <span className="text-sm opacity-80">when the day is done</span>
        </h2>

        {/* DATE */}
        <label className="text-sm opacity-80">DATE</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mt-1 mb-3 bg-white/20 p-2 rounded-lg text-white"
        />

        {/* MOOD */}
        <label className="text-sm opacity-80">MOOD</label>
        <div className="flex gap-2 mt-2 mb-4">

          {["GOOD", "MEH", "BAD"].map((m) => (
            <button
              key={m}
              onClick={() => setMood(mood === m ? "" : m)}
              className={`mood-btn 
                ${m.toLowerCase()} 
                ${mood === m ? "active" : ""}`}
            >
              <span className="transition"></span>
              <span className="label">
                {m === "GOOD" && "GOOD"}
                {m === "MEH" && "MEH"}
                {m === "BAD" && "BAD"}
              </span>
            </button>
          ))}

        </div>

        {/* ACTIVITY */}
        <label className="text-sm opacity-80">ACTIVITY</label>
        <div className="flex items-center gap-2 mt-1 mb-4">
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="flex-1 p-2 bg-white/20 rounded-lg text-white"
          >
            <option value="">Select Activity</option>
            {activities.map((a) => (
              <option key={a._id} value={a._id}>
                {a.title}
              </option>
            ))}
          </select>
          
          <button
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg"
            onClick={() => setModalOpen(true)}
          >
            + Add New
          </button>

          
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="mt-2 w-full bg-white/30 hover:bg-white/40 p-2 rounded-lg font-semibold"
        >
          Save
        </button>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-xl w-80 shadow-lg z-50">
            <h3 className="text-lg font-bold mb-3">Add New Activity</h3>

            <label>Title</label>
            <input
              className="w-full p-2 border rounded mb-3"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <TimeInput24
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
            />

            <TimeInput24
              label="End Time"
              value={endTime}
              onChange={setEndTime}
            />

            <label className="mt-3">Color</label>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-full h-10 rounded mb-3 cursor-pointer"
            />

            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={saveAsRoutine}
                onChange={(e) => setSaveAsRoutine(e.target.checked)}
              />
              <label>Save as routine activity</label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={saveNewActivity}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
