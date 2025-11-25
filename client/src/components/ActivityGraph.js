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

    const ts = new Date(a.date + "T00:00:00Z").getTime();

    let start = toHour(a.start);
    let end = toHour(a.end);

    if (end < start) end += 24;

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
        borderRadius: 4
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

        afterBuildTicks: (scale) => {
          const range = scale.max - scale.min;
          const days = range / (24 * 60 * 60 * 1000);

          let thickness;
          if (days > 90) thickness = 4;
          else if (days > 30) thickness = 10;
          else if (days > 10) thickness = 16;
          else thickness = 20;

          scale.chart.data.datasets.forEach(ds => {
            ds.barThickness = thickness;
            ds.maxBarThickness = thickness;
          });
        }
      },

      y: {
        reverse: true,
        min: 0,
        max: 24,

        grid: {
          color: "rgba(0,0,0,0.08)"
        },

        ticks: {
          stepSize: 1,
          callback: (v) => `${String(v).padStart(2, "0")}:00`,
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: { size: 10 }
        }
      }
    },

    // ⭐ ADD THIS ⭐
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
            const [start, end] = ctx.raw.y;

            const format = (v) => {
              let h = Math.floor(v);
              let m = Math.round((v - h) * 60);
              if (h >= 24) h -= 24;
              return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
            };

            return `Activity: ${format(start)} → ${format(end)}`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-[500px] bg-white p-4 rounded-xl shadow-lg mt-5">
      <Chart
        key={(sharedRange?.min || 0) + "-" + (sharedRange?.max || 0)}
        type="bar"
        data={data}
        options={options}
      />
    </div>
  );
}
