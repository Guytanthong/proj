import  { useRef } from "react";
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
function toHour(str) {
  const [h, m] = str.split(":").map(Number);
  return h + m / 60;
}

function moodColor(mood) {
  if (mood === "GOOD") return "#22c55e";
  if (mood === "MEH") return "#f59e0b";
  if (mood === "BAD") return "#ef4444";
  return "#9ca3af";
}

export default function SleepGraph({ sleepData, moodData, onRangeChange, sharedRange }) {
  const chartRef = useRef(null);

  // Mood one-day shift
  const moodMap = {};
  moodData.forEach((m) => {
    const d = new Date(m.date);
    d.setDate(d.getDate() - 1);
    moodMap[d.toISOString().split("T")[0]] = m.mood;
  });

  // Sleep format
  const formatted = sleepData.map((entry) => {
    const iso = entry.date.split("T")[0];

    const ts = new Date(iso + "T00:00:00Z").getTime();  // ⭐ SAME AS ActivityGraph & presets

    let start = toHour(entry.sleepTime);
    let end = toHour(entry.wakeTime);

    if (end < start) end += 24;
    if (start < 15) start += 24;
    if (end < 15) end += 24;

    return {
      iso,
      ts,
      startHour: start,
      endHour: end,
      mood: moodMap[iso] || "NONE"
    };
  });

  const data = {
    datasets: [
      {
        type: "bar",
        label: "Sleep",
        data: formatted.map((d, i) => ({
          x: d.ts + i * 60000,   // add 1 minute spacing per bar
          y: [d.startHour, d.endHour]
        })),
        backgroundColor: formatted.map((d) => moodColor(d.mood)),
        borderRadius: 6,
        barThickness: 20,
        maxBarThickness: 20,
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
          tooltipFormat: "dd MMM yyyy"
        },
        min: sharedRange?.min,
        max: sharedRange?.max,
        offset: true,
      },

      y: {
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

        afterBuildTicks(scale) {
          const ticks = [];
          for (let v = 15; v <= 42; v += 3) ticks.push({ value: v });
          scale.ticks = ticks;
        }
      }
    },

    plugins: {
      tooltip: {
        callbacks: {
          title: (ctx) => {
            const ts = ctx[0].raw.x;
            return new Date(ts).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            });
          },
          label: (ctx) => {
            const [s, e] = ctx.raw.y;
            const fmt = (v) => {
              let h = Math.floor(v);
              let m = Math.round((v - h) * 60);
              if (h >= 24) h -= 24;
              return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
            };
            return `Sleep: ${fmt(s)} → ${fmt(e)}`;
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
