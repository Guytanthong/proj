import React from "react";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip
} from "chart.js";

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip
);




/* -------------------------
   BAR LABEL PLUGIN
------------------------- */
const barLabelPlugin = {
  id: "barLabelPlugin",
  afterDatasetsDraw(chart) {
    const ds = chart.data.datasets[0];
    if (!ds || !ds._formatted) return;

    const meta = chart.getDatasetMeta(0);
    const { ctx } = chart;

    meta.data.forEach((bar, index) => {
      const act = ds._formatted[index];
      if (!act) return;

      const { x, y, base } = bar.getProps(["x", "y", "base"], true);

      const top = Math.min(y, base);
      const bottom = Math.max(y, base);
      const centerY = (top + bottom) / 2;

      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = "600 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(act.title, x, centerY);
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
  

  /* -------------------------
     FIXED DATE CREATION (NO TIMEZONE SHIFT)
  ------------------------- */
  const formatted = activityData.map(a => {
  // LOCAL MIDNIGHT (NOT UTC!)
  const ts = new Date(a.date);
  ts.setHours(0, 0, 0, 0);

  let start = toHour(a.start);
  let end = toHour(a.end);

  if (end < start) end += 24;

  return {
    x: ts.getTime(),
    startHour: start,
    endHour: end,
    color: a.color || "#a78bfa",
    title: a.title
  };
});

  const data = {
    datasets: [
      {
        label: "Activity",
        type: "bar",
        data: formatted.map(a => ({
          x: a.x,
          y: [a.endHour, a.startHour] 
        })),
        backgroundColor: formatted.map(a => a.color),
        borderRadius: 4,
        _formatted: formatted,
        barPercentage: 1,
        categoryPercentage: 1

      }
    ]
  };

  const options = {
    plugins: {
    tooltip: {
      displayColors: false,     //remove the color square
      bodyFont: { size: 14 },   // bigger text
      titleFont: { size: 14 },
      padding: 10,

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
        const act = formatted[ctx.dataIndex];
        const [start, end] = ctx.raw.y;

        const format = (v) => {
          let h = Math.floor(v);
          let m = Math.round((v - h) * 60);
          if (h >= 24) h -= 24;
          return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        };

            return [
              `📝 ${act.title}`,          // 🔥 title line
              `${format(start)} → ${format(end)}`  // 🔥 time line
            ];
          }
        }
      }
    },

    responsive: true,
    maintainAspectRatio: false,
    
    scales: {
      x: {
        type: "time",
        time: { unit: "day", tooltipFormat: "dd MMM yyyy" },

        min: sharedRange?.min,
        max: sharedRange?.max
          ? sharedRange.max + 60 * 60 * 1000  // ⭐ add 1 extra day
          : undefined,
        grid: { color: "rgba(170, 164, 164, 0.18)" },
        offset: true
      },
      y: {
        reverse: true,
        min: 0,
        max: 24,
        ticks: {
          stepSize: 1,
          callback: v => `${String(v).padStart(2, "0")}:00`,
          font: {
            size: 14,            // ← increase font size
            weight: "500"
          }
        },
        grid: { 
          color: (ctx) => {
            const hour = ctx.tick.value;

            // highlight 6, 12, 18
            if (hour === 6 || hour === 12 || hour === 18) {
              return "rgba(106, 204, 49, 0.16)";
            }

            // normal grid
            return "rgba(170, 164, 164, 0.18)";
          },
          lineWidth: (ctx) => {
            const hour = ctx.tick.value;
            return (hour === 6 || hour === 12 || hour === 18) ? 3 : 1;
          }
        }
      },
      yRight: {
        position: "right",      // put ticks on the right
        reverse: true,          // match left axis
        min: 0,
        max: 24,
        ticks: {
          stepSize: 1,
          callback: (v) => `${String(v).padStart(2, "0")}:00`,
          font: { size: 14 }
        },
        grid: {
          drawOnChartArea: false,   //don't duplicate the grid lines
        }
      }
    }
  };

  return (
    <div className="w-full h-[700px] bg-[#0f172a] p-4 rounded-xl shadow-lg mt-5">
      <Chart
        key={(sharedRange?.min || 0) + "-" + (sharedRange?.max || 0)}
        type="bar"
        data={data}
        options={options}
      />
    </div>
  );
}  