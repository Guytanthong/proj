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

/* ---------------------------------------------
   SAFE BAR LABEL PLUGIN (NO INTERNAL PROPS!)
--------------------------------------------- */
const barLabelPlugin = {
  id: "barLabelPlugin",
  afterDatasetsDraw(chart) {
    const { ctx, data, scales } = chart;

    const ds = data.datasets[0];
    const items = ds._formatted; // safe reference
    const bars = chart.getDatasetMeta(0).data;

    if (!items || !bars) return;

    bars.forEach((bar, index) => {
      const act = items[index];
      if (!act) return;

      // Convert hour → pixel using official API
      const yTop = scales.y.getPixelForValue(act.startHour);
      const yBottom = scales.y.getPixelForValue(act.endHour);
      const yCenter = (yTop + yBottom) / 2;

      const x = scales.x.getPixelForValue(act.x);

      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(act.title, x, yCenter);
      ctx.restore();
    });
  }
};

ChartJS.register(barLabelPlugin);

/* HH:MM → float */
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
        borderRadius: 4,

        // store a reference for plugin
        _formatted: formatted
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        type: "time",
        time: { unit: "day", tooltipFormat: "dd MMM yyyy" },
        min: sharedRange?.min,
        max: sharedRange?.max,
        offset: true
      },

      y: {
        reverse: true,
        min: 0,
        max: 24,
        ticks: {
          stepSize: 1,
          callback: v => `${String(v).padStart(2, "0")}:00`
        },
        grid: { color: "rgba(0,0,0,0.08)" }
      }
    },

    plugins: {
      tooltip: {
        callbacks: {
          title: ctx => {
            const ts = ctx[0].raw.x;
            return new Date(ts).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            });
          },
          label: ctx => {
            const act = formatted[ctx.dataIndex];
            const [start, end] = ctx.raw.y;

            const formatTime = v => {
              let h = Math.floor(v);
              let m = Math.round((v - h) * 60);
              if (h >= 24) h -= 24;
              return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
            };

            return [`${act.title}`, `${formatTime(start)} → ${formatTime(end)}`];
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
