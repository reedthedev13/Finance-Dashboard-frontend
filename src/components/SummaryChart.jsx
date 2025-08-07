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
    <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">
        Monthly Summary
      </h2>
      {safeData.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-slate-400">
          No summary data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={safeData}>
            <XAxis
              dataKey="month"
              stroke="currentColor"
              tick={{ fill: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
              axisLine={{ stroke: "currentColor" }}
            />
            <YAxis
              stroke="currentColor"
              tick={{ fill: "currentColor" }}
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
            <Legend wrapperClassName="text-slate-300 dark:text-slate-400" />
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
      )}
    </div>
  );
};

export default SummaryChart;
