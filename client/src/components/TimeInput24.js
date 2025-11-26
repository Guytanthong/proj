import { useState } from "react";

export default function TimeInput24({ label, value, onChange }) {
  const [open, setOpen] = useState(false);

  const hours12 = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  // Parse existing value to 12h format
  let currentHour = 12;
  let currentMinute = "00";
  let currentPeriod = "AM";

  if (value && value.includes(":")) {
    const [hh, mm] = value.split(":");
    currentMinute = mm;
    const h = Number(hh);

    if (h === 0) {
      currentHour = 12;
      currentPeriod = "AM";
    } else if (h === 12) {
      currentHour = 12;
      currentPeriod = "PM";
    } else if (h > 12) {
      currentHour = h - 12;
      currentPeriod = "PM";
    } else {
      currentHour = h;
      currentPeriod = "AM";
    }
  }

  // ALWAYS produce valid HH:MM 24h
  const updateFinal = (h12, m, period) => {
    let hour = Number(h12);

    if (period === "AM" && hour === 12) hour = 0;
    if (period === "PM" && hour !== 12) hour += 12;

    const final = `${String(hour).padStart(2, "0")}:${m}`;
    onChange(final);
  };

  return (
    <div className="mb-3 relative">
      {label && <label className="text-sm opacity-80">{label}</label>}

      <input
        type="text"
        value={value}
        placeholder="hh:mm"
        onClick={() => setOpen(!open)}
        readOnly
        className="w-full bg-gray-100 text-black p-2 rounded-lg mt-1 text-center border cursor-pointer"
      />

      {open && (
        <div className="absolute mt-1 left-0 right-0 bg-white p-2 rounded-lg shadow-xl z-[9999] flex gap-2 justify-center">
          
          {/* HOURS */}
          <div className="max-h-48 overflow-y-scroll pr-1 border-r">
            {hours12.map((h) => (
              <div
                key={h}
                onClick={() => {
                  updateFinal(h, currentMinute, currentPeriod);
                }}
                className={`p-2 text-center cursor-pointer hover:bg-blue-100 ${
                  Number(h) === currentHour ? "bg-blue-200 font-bold" : ""
                }`}
              >
                {h}
              </div>
            ))}
          </div>

          {/* MINUTES */}
          <div className="max-h-48 overflow-y-scroll pr-1 border-r">
            {minutes.map((m) => (
              <div
                key={m}
                onClick={() => {
                  updateFinal(String(currentHour).padStart(2, "0"), m, currentPeriod);
                }}
                className={`p-2 text-center cursor-pointer hover:bg-blue-100 ${
                  m === currentMinute ? "bg-blue-200 font-bold" : ""
                }`}
              >
                {m}
              </div>
            ))}
          </div>

          {/* AM/PM */}
          <div className="max-h-48 overflow-y-scroll">
            {periods.map((p) => (
              <div
                key={p}
                onClick={() => {
                  updateFinal(String(currentHour).padStart(2, "0"), currentMinute, p);
                }}
                className={`p-2 text-center cursor-pointer hover:bg-blue-100 ${
                  p === currentPeriod ? "bg-blue-200 font-bold" : ""
                }`}
              >
                {p}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
