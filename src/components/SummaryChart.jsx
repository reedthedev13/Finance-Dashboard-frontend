import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SummaryChart = ({ data }) => {
  const safeData = data || [];

  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200 text-center sm:text-left">
        Monthly Summary
      </h2>

      {safeData.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-slate-400">
          No summary data available
        </p>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={safeData}>
                <XAxis
                  dataKey="month"
                  stroke="currentColor"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  tickLine={{ stroke: "currentColor" }}
                  axisLine={{ stroke: "currentColor" }}
                />
                <YAxis
                  stroke="currentColor"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  tickLine={{ stroke: "currentColor" }}
                  axisLine={{ stroke: "currentColor" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                  itemStyle={{ color: "#f1f5f9" }}
                />
                <Legend wrapperClassName="text-slate-300 dark:text-slate-400 text-xs sm:text-sm" />
                <Bar
                  dataKey="total_income"
                  fill="#10b981"
                  fillOpacity={0.8}
                  name="Income"
                />
                <Bar
                  dataKey="total_expense"
                  fill="#ef4444"
                  fillOpacity={0.8}
                  name="Expenses"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryChart;
