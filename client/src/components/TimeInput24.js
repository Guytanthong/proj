import { useState } from "react";

export default function TimeInput24({ label, value, onChange }) {
  const [open, setOpen] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const handleSelect = (h12, m, period) => {
    let h = Number(h12);

    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;

    const final = `${String(h).padStart(2, "0")}:${m}`;
    onChange(final);
    setOpen(false);
  };

  // parse existing value to 12h format for highlighting
  let currentH = 12,
    currentM = "00",
    currentPeriod = "AM";

  if (value && value.includes(":")) {
    const [hh, mm] = value.split(":");
    const h = Number(hh);

    currentM = mm;

    if (h === 0) {
      currentH = 12;
      currentPeriod = "AM";
    } else if (h === 12) {
      currentH = 12;
      currentPeriod = "PM";
    } else if (h > 12) {
      currentH = h - 12;
      currentPeriod = "PM";
    } else {
      currentH = h;
      currentPeriod = "AM";
    }
  }

  const handleChange = (e) => {
    let v = e.target.value.replace(/[^0-9:]/g, "");
    if (v.length === 2 && !v.includes(":")) v += ":";
    if (v.length > 5) v = v.slice(0, 5);
    onChange(v);
  };

  return (
    <div className="mb-3 relative">
      {label && <label className="text-sm opacity-80">{label}</label>}

      <input
        type="text"
        value={value}
        placeholder="hh:mm"
        onChange={handleChange}
        onClick={() => setOpen(!open)}
        className="w-full bg-gray-100 text-black p-2 rounded-lg mt-1 text-center border cursor-pointer"
      />

      {open && (
        <div className="absolute mt-1 left-0 right-0 bg-white p-2 rounded-lg shadow-xl z-[9999] flex gap-2 justify-center">
          {/* HOURS */}
          <div className="max-h-48 overflow-y-scroll pr-1 border-r">
            {hours.map((h) => (
              <div
                key={h}
                onClick={() =>
                  handleSelect(h, currentM, currentPeriod)
                }
                className={`p-2 text-center cursor-pointer hover:bg-blue-100 ${
                  Number(h) === currentH ? "bg-blue-200 font-bold" : ""
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
                onClick={() =>
                  handleSelect(
                    String(currentH).padStart(2, "0"),
                    m,
                    currentPeriod
                  )
                }
                className={`p-2 text-center cursor-pointer hover:bg-blue-100 ${
                  m === currentM ? "bg-blue-200 font-bold" : ""
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
                onClick={() =>
                  handleSelect(
                    String(currentH).padStart(2, "0"),
                    currentM,
                    p
                  )
                }
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
