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
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2 text-slate-700">
        Monthly Summary
      </h2>
      {safeData.length === 0 ? (
        <p className="text-center text-gray-500">No summary data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={safeData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SummaryChart;
