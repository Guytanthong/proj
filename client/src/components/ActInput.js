import { useState, useEffect } from "react";
import axios from "axios";
import TimeInput24 from "./TimeInput24";

export default function ActInput() {
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");
  const [newColor, setNewColor] = useState("#3b82f6");

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Load activities
  useEffect(() => {
    async function load() {
      const res = await axios.get("http://localhost:5000/api/activity/all");
      setActivities(res.data);
    }
    load();
  }, []);

  // Since TimeInput24 already returns "HH:mm", no conversion needed
  function to24h(str) {
    return str;
  }

  async function handleSave() {
    if (!date) return alert("Please choose a date!");
    if (!mood && !selectedActivity)
      return alert("Select at least MOOD or ACTIVITY.");

    if (mood) {
      await axios.post("http://localhost:5000/api/mood", { date, mood });
    }

    if (selectedActivity) {
      const template = activities.find(a => a._id === selectedActivity);

      if (!template) return alert("Activity not found!");

      await axios.post("http://localhost:5000/api/activity/log", {
        date,
        title: template.title,
        start: template.start,
        end: template.end,
        color: template.color
      });
    }

    alert("Saved!");
  }

  async function saveNewActivity() {
    if (!newTitle || !startTime || !endTime)
      return alert("Fill all Activity fields!");

    const start24 = to24h(startTime);
    const end24 = to24h(endTime);

    await axios.post("http://localhost:5000/api/activity/create", {
      title: newTitle,
      date,
      start: start24,
      end: end24,
      color: newColor,
    });

    alert("New Activity Added!");

    // Reset modal fields
    setModalOpen(false);
    setNewTitle("");
    setStartTime("");
    setEndTime("");

    // Reload activities
    const res = await axios.get("http://localhost:5000/api/activity/all");
    setActivities(res.data);
  }

  return (
    <>
    <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-6 rounded-2xl shadow-lg text-white">

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
            className={`px-3 py-2 rounded-lg transition-all ${
              mood === m ? "bg-white/40 border border-white shadow-lg" : "bg-white/20"
            }`}
          >
            {m === "GOOD" && "😊 GOOD"}
            {m === "MEH" && "😐 MEH"}
            {m === "BAD" && "😞 BAD"}
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
