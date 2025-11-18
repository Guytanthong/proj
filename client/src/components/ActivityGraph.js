import React from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip
} from "chart.js";

import "chartjs-adapter-date-fns";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip
);

// Convert HH:MM → 24h float
function toHour(str) {
  const [h, m] = str.split(":").map(Number);
  return h + m / 60;
}

export default function ActivityGraph({ activityData, sharedRange }) {

  const formatted = activityData.map(a => {

  // ⭐ DO NOT use new Date(a.date) → causes timezone shifts
  const ts = new Date(a.date + "T00:00:00Z").getTime();

  let start = toHour(a.start);
  let end = toHour(a.end);

  // midnight correction (must match SleepGraph EXACTLY)
  if (end < start) end += 24;
  if (start < 15) start += 24;
  if (end < 15) end += 24;

  return {
    x: ts,
    startHour: start,
    endHour: end,
    color: a.color || "#a78bfa",
    title: a.title
  };
});

  const data = {
    datasets: [
      {
        type: "bar",
        label: "Activity",
        data: formatted.map(a => ({
        x: a.x,
        y: [a.startHour, a.endHour]
        })),
        backgroundColor: formatted.map(a => a.color),
        borderRadius: 4,
        barPercentage: 0.9
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        type: "time",
        time: { unit: "day" },

        // ⭐ IMPORTANT: use exact values or undefined (NOT null)
        min: sharedRange ? sharedRange.min : undefined,
        max: sharedRange ? sharedRange.max : undefined,
      },
      y: {
        reverse: true,
        min: 18,
        max: 39,

        ticks: {
            stepSize: 3,
            callback: (v) => {
            if (v >= 24) v -= 24;
            return `${String(v).padStart(2, "0")}:00`;
            }
        },

        // ⭐ SAME TICK FIX AS SleepGraph
        afterBuildTicks: (scale) => {
            const ticks = [];
            for (let v = 15; v <= 42; v += 3) {
            ticks.push({ value: v });
            }
            scale.ticks = ticks;
        }
        }
    }
  };

  return (
    <div className="w-full h-[250px] bg-white p-4 rounded-xl shadow-lg mt-5">
      {/* ⭐ FORCE rerender when sharedRange updates */}
      <Chart
        key={(sharedRange?.min || 0) + "-" + (sharedRange?.max || 0)}
        type="bar"
        data={data}
        options={options}
      />
    </div>
  );
}
