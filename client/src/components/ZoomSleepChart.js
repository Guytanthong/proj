import React, { useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip
} from "chart.js";

import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart } from "react-chartjs-2";

// Register what we need
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  zoomPlugin
);

// Convert "23:30" → 23.5
function toHour(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h + m / 60;
}

// Mood → Color
function moodColor(mood) {
  if (mood === "GOOD") return "#22c55e";   // green
  if (mood === "MEH") return "#f59e0b";    // orange
  if (mood === "BAD") return "#ef4444";    // red
  return "#9ca3af"; // grey (default)
}

export default function NightSleepGraph({ sleepData = [], moodData = [] }) {
  const chartRef = useRef(null);

  // Build mood lookup table
  const moodMap = {};
  moodData.forEach((m) => {
    // mood belongs to previous night's sleep → shift backward 1 day
    const moodDay = new Date(m.date);
    moodDay.setDate(moodDay.getDate() - 1);

    const key = moodDay.toISOString().split("T")[0];
    moodMap[key] = m.mood;
  });

  // Convert sleep entries into chart values (15 → 42h system)
  const formatted = sleepData.map(entry => {
    const day = entry.date.split("T")[0];

    let start = toHour(entry.sleepTime);
    let end = toHour(entry.wakeTime);

    // Midnight wrap
    if (end < start) end += 24;

    // Align to custom Y-axis range
    if (start < 15) start += 24;
    if (end < 15) end += 24;

    return {
      date: day,
      startHour: start,
      endHour: end,
      mood: moodMap[day] || "NONE",
    };
  });

  const data = {
    datasets: [
      {
        type: "bar",
        label: "Sleep",
        data: formatted.map(item => ({
          x: item.date,
          y: [item.startHour, item.endHour]
        })),
        backgroundColor: formatted.map(item => moodColor(item.mood)),
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.9
      }
    ]
  };

  const options = {
        indexAxis: "x",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                type: "linear",
                min: 18,
                max: 39,
                reverse: true,

                ticks: {
                    stepSize: 3,
                    callback: (value) => {
                        let v = value;
                        if (v >= 24) v -= 24;
                        return `${String(v).padStart(2, "0")}:00`;
                    },
                },

                // removes ANY fractional ticks FOREVER
                afterBuildTicks: (scale) => {
                    const ticks = [];

                    // round min and max to nearest integers (down for min, up for max)
                    const min = Math.floor(scale.min);
                    const max = Math.ceil(scale.max);

                    // generate ticks at clean 3-hour intervals
                    for (let v = min; v <= max; v += 3) {
                        ticks.push({ value: v });
                    }

                    scale.ticks = ticks;
                },
            },
            x: {
            type: "time",
            time: { unit: "day" },
            title: { display: true, text: "Date" }
            }
        },
        plugins: {
            zoom: {
            zoom: { wheel: { enabled: true }, mode: "y" },
            pan: { enabled: true, mode: "y" },
            limits: {y: { min: 0, max: 48 }   // allow scrolling entire range
            }
            }
        }
    };


  return (
    <div className="w-full h-[500px] bg-white p-4 rounded-xl shadow-lg">
      <Chart ref={chartRef} type="bar" data={data} options={options} />
    </div>
  );
}
