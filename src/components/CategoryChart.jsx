import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366F1", // Indigo
  "#06B6D4", // Cyan
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#A855F7", // Purple
];

const CategoryChart = ({ data }) => {
  if (!data?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 text-center text-gray-500 dark:text-gray-400">
        <h2 className="text-lg font-semibold mb-2 text-slate-700 dark:text-gray-200">
          Expenses by Category
        </h2>
        <p>No category data available</p>
      </div>
    );
  }

  // Custom tooltip content with dark mode support
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-2 rounded shadow"
          style={{
            backgroundColor: "var(--tw-bg-opacity, 1) #1e293b", // slate-800 dark bg
            color: "var(--tw-text-opacity, 1) #f1f5f9", // slate-100 text
            border: "none",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <p>{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2 text-slate-700 dark:text-gray-200">
        Expenses by Category
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={{ fill: "currentColor" }} // inherit current text color
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.8}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperClassName="text-slate-700 dark:text-gray-200"
            formatter={(value) => (
              <span className="dark:text-gray-200">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
