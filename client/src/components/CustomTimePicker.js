

export default function CustomTimePicker({ label, value, onChange }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const ampm = ["AM", "PM"];

  function update(part, val) {
    onChange({
      hour: value?.hour ?? 12,
      minute: value?.minute ?? 0,
      ampm: value?.ampm ?? "AM",
      [part]: val,
    });
  }

  return (
    <div className="mb-3">
      <label className="text-sm opacity-80">{label}</label>
      <div className="flex items-center gap-2 bg-white/25 p-3 rounded-xl mt-1">

        {/* HOUR */}
        <select
          className="text-black bg-white rounded px-2 py-1"
          value={value?.hour ?? 12}
          onChange={(e) => update("hour", Number(e.target.value))}
        >
          {hours.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <span className="text-white">:</span>

        {/* MINUTE */}
        <select
          className="text-black bg-white rounded px-2 py-1"
          value={value?.minute ?? 0}
          onChange={(e) => update("minute", Number(e.target.value))}
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, "0")}
            </option>
          ))}
        </select>

        {/* AM/PM */}
        <select
          className="text-black bg-white rounded px-2 py-1"
          value={value?.ampm ?? "AM"}
          onChange={(e) => update("ampm", e.target.value)}
        >
          {ampm.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

      </div>
    </div>
  );
}
