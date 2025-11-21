import React, { useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip
} from "chart.js";

import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  zoomPlugin
);

// Convert "HH:MM" → hours float
function toHour(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h + m / 60;
}

function moodColor(mood) {
  if (mood === "GOOD") return "#22c55e";
  if (mood === "MEH") return "#f59e0b";
  if (mood === "BAD") return "#ef4444";
  return "#9ca3af";
}

export default function SleepGraph({ sleepData, moodData, onRangeChange,sharedRange}) {
  const chartRef = useRef(null);

  // Build mood map (shift mood to previous day)
  const moodMap = {};
  moodData.forEach((m) => {
    const d = new Date(m.date);
    d.setDate(d.getDate() - 1);
    const k = d.toISOString().split("T")[0];
    moodMap[k] = m.mood;
  });

  // Format sleep data
  const formatted = sleepData.map((entry) => {
    const day = entry.date.split("T")[0];
    let start = toHour(entry.sleepTime);
    let end = toHour(entry.wakeTime);

    if (end < start) end += 24;
    if (start < 15) start += 24;
    if (end < 15) end += 24;

    return {
      date: day,
      startHour: start,
      endHour: end,
      mood: moodMap[day] || "NONE"
    };
  });

  const data = {
    datasets: [
      {
        type: "bar",
        label: "Sleep",
        data: formatted.map((d) => ({
          x: new Date(d.date).getTime(),
          y: [d.startHour, d.endHour],
        })),
        backgroundColor: formatted.map((d) => moodColor(d.mood)),
        borderRadius: 6,

        // make bars align with day column
        barThickness: 'flex',
        maxBarThickness: 20,
        categoryPercentage: 1.0,
        barPercentage: 1.0,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
          type: "time",
          time: {
            unit: "day",
            round: "day",
          },
          offset: true,     // centers bars inside date block
          grouped: false,
          min: sharedRange?.min ?? undefined,
          max: sharedRange?.max ?? undefined,
        },
      y: {
        type: "linear",
        reverse: true,
        min: Math.min(...formatted.map(d => d.startHour)) - 1,
        max: Math.max(...formatted.map(d => d.endHour)) + 1,
        ticks: {
          stepSize: 3,
          callback: (v) => {
            if (v >= 24) v -= 24;
            return `${String(v).padStart(2, "0")}:00`;
          }
        },
        afterBuildTicks: (scale) => {
          const t = [];
          for (let v = 15; v <= 42; v += 3) {
            t.push({ value: v });
          }
          scale.ticks = t;
        }
      }
    },

    plugins: {

      tooltip: {
        callbacks: {

          title: (context) => {
            const date = new Date(context[0].raw.x);
            return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            });
          },

          label: (context) => {
            const [rawStart, rawEnd] = context.raw.y;

            // Convert fractional hour → hh:mm
            const toTime = (v) => {
              let h = Math.floor(v);
              let m = Math.round((v - h) * 60);

              // wrap after 24h
              if (h >= 24) h -= 24;

              return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
            };

            return `Sleep: ${toTime(rawStart)} → ${toTime(rawEnd)}`;
          }
        }
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          mode: "x",
        },
        pan: {
          enabled: true,
          mode: "x",
        },
        // 🔥 Call parent to sync ActivityGraph
        onZoomComplete: ({ chart }) => {
          const x = chart.scales.x;
          onRangeChange({ min: x.min, max: x.max });
        },
        onPanComplete: ({ chart }) => {
          const x = chart.scales.x;
          onRangeChange({ min: x.min, max: x.max });
        }
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-xl shadow-lg mb-10">
      <Chart ref={chartRef} type="bar" data={data} options={options} />
    </div>
  );
}
