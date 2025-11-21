import React from "react";

export default function TimeInput24({ label, value, onChange }) {
  const handleChange = (e) => {
    let v = e.target.value;

    // Allow only numbers + colon
    v = v.replace(/[^0-9:]/g, "");

    // Auto-add colon after HH
    if (v.length === 2 && !v.includes(":")) {
      v = v + ":";
    }

    // Limit to HH:mm
    if (v.length > 5) v = v.slice(0, 5);

    // Validate HH and mm
    const [h, m] = v.split(":");

    if (h && Number(h) > 23) return;
    if (m && Number(m) > 59) return;

    onChange(v);
  };

  return (
    <div className="mb-3">
      <label className="text-sm opacity-80">{label}</label>
      <input
        type="text"
        placeholder="hh:mm"
        value={value ?? ""}
        maxLength={5}
        onChange={handleChange}
        className="w-full bg-white/25 text-white p-3 rounded-xl mt-1 text-center outline-none"
      />
    </div>
  );
}
