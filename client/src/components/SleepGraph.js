import { useRef, useEffect } from "react";
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

export default function SleepGraph({ sleepData, moodData, sharedRange }) {
  const chartRef = useRef(null);

  // Mood 1-day shift map
  const moodMap = {};
  moodData.forEach((m) => {
    const d = new Date(m.date);
    d.setDate(d.getDate() - 1);
    moodMap[d.toISOString().split("T")[0]] = m.mood;
  });

  // Format sleep data
  const formatted = sleepData.map((entry) => {
    const iso = entry.date.split("T")[0];

    const tsDate = new Date(iso);
    tsDate.setHours(0, 0, 0, 0);
    const ts = tsDate.getTime();

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
        data: formatted.map((d) => ({
          x: d.ts,
          y: [d.startHour, d.endHour],
        })),
        backgroundColor: formatted.map((d) => moodColor(d.mood)),
        borderRadius: 6,
        barThickness: "flex",
        maxBarThickness: 20,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
      padding: 20,
    },

    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "dd MMM yyyy",
        },
        min: sharedRange?.min,
        max: sharedRange?.max,
        offset: true,

        grid: {
          color: "rgba(255,255,255,0.06)",
          lineWidth: 1,
        },

        ticks: {
          color: "#cbd5e1",
          font: { size: 12 },
        },

        afterBuildTicks: (scale) => {
          const range = scale.max - scale.min;
          const days = range / (24 * 60 * 60 * 1000);

          let thickness;
          if (days > 90) thickness = 4;
          else if (days > 30) thickness = 10;
          else if (days > 10) thickness = 16;
          else thickness = 20;

          scale.chart.data.datasets.forEach((ds) => {
            ds.barThickness = thickness;
            ds.maxBarThickness = thickness;
          });
        },
      },

      y: {
        reverse: true,
        min: Math.min(...formatted.map((d) => d.startHour)) - 1,
        max: Math.max(...formatted.map((d) => d.endHour)) + 1,

        grid: {
          color: "rgba(255,255,255,0.05)",
        },

        ticks: {
          stepSize: 3,
          color: "#94a3b8",
          font: { size: 12 },
          callback: (v) => {
            if (v >= 24) v -= 24;
            return `${String(v).padStart(2, "0")}:00`;
          },
        },

        afterBuildTicks(scale) {
          const ticks = [];
          for (let v = 15; v <= 42; v += 3) ticks.push({ value: v });
          scale.ticks = ticks;
        },
      },
    },

    plugins: {
      legend: { display: false },

      tooltip: {
        backgroundColor: "rgba(15,23,42,0.9)",
        borderColor: "#334155",
        borderWidth: 1,
        titleColor: "#f1f5f9",
        bodyColor: "#e2e8f0",

        callbacks: {
          title: (ctx) => {
            const ts = ctx[0].raw.x;
            return new Date(ts).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
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
          },
        },
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
      },
    },
  };

  // Reset zoom when range changes
  useEffect(() => {
    if (!chartRef.current) return;
    try {
      chartRef.current.resetZoom();
    } catch {}
  }, [sharedRange]);

  return (
    <div className="w-full h-[480px] rounded-xl shadow-lg bg-[#0f172a]">
      <Chart
        key={(sharedRange?.min || 0) + "-" + (sharedRange?.max || 0)}
        ref={chartRef}
        type="bar"
        data={data}
        options={options}
      />
    </div>
  );
}
