export default function KeyInformation() {
  return (
    <div className="min-h-screen bg-gray-950 pt-20 text-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Key Information & Insights
          </h1>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg">
              7D
            </button>
            <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg">
              30D
            </button>
            <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg">
              1Y
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-4 gap-5 mb-10">
          <SummaryCard label="Avg Sleep" value="7.2 hrs" trend="+0.4" />
          <SummaryCard label="Sleep Consistency" value="82%" trend="+6%" />
          <SummaryCard label="Average Mood" value="😊 Good" trend="Stable" />
          <SummaryCard label="Productive Time" value="62%" trend="+9%" />
        </div>

        {/* SLEEP + MOOD SECTION */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <PlaceholderPanel title="Sleep Trend Chart" />
          <PlaceholderPanel title="Mood Trend Chart" />
        </div>

        {/* ACTIVITY SECTION */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <PlaceholderPanel title="Productive vs Relax Time" />
          <PlaceholderPanel title="Most Frequent Activities" />
        </div>

        {/* SMART INSIGHTS */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">
            Smart Insights 🔍
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <InsightCard text="You sleep 1.2 hours longer on weekends." />
            <InsightCard text="When you sleep ≥ 7 hours, your mood improves 64% of the time." />
            <InsightCard text="Workout days are your happiest days 💪" />
            <InsightCard text="Your bedtime shifted 25 mins later this month." />
          </div>
        </div>

      </div>
    </div>
  );
}


/* ------------------- SMALL UI COMPONENTS ------------------- */

function SummaryCard({ label, value, trend }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <p className="text-gray-400 text-sm">{label}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      <p className="text-green-400 text-sm mt-1">{trend}</p>
    </div>
  );
}

function PlaceholderPanel({ title }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 h-[250px] flex items-center justify-center">
      <p className="text-gray-400">{title} (coming soon)</p>
    </div>
  );
}

function InsightCard({ text }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      {text}
    </div>
  );
}