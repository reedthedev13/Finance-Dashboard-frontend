import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format, parseISO } from "date-fns";
import { FiUpload, FiDownload, FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { saveAs } from "file-saver";
import "./index.css";

Chart.register(...registerables);

const API_URL = "https://finance-dashboard-backend-7r50.onrender.com/api";

function App() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [newTransactions, setNewTransactions] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    amount: "",
    category: "",
    description: "",
    type: "expense",
  });
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchSummaries();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error Fetching Transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaries = async () => {
    try {
      const [monthlyRes, categoryRes] = await Promise.all([
        axios.get(`${API_URL}/summary/monthly`),
        axios.get(`${API_URL}/summary/categories`),
      ]);
      setMonthlySummary(monthlyRes.data || []);
      setCategorySummary(categoryRes.data || []);
    } catch (error) {
      console.error("Error Fetching Summaries", error);
      setMonthlySummary([]);
      setCategorySummary([]);
    }
  };

  const addTransaction = async () => {
    try {
      await axios.post(`${API_URL}/transactions`, {
        ...newTransactions,
        amount: parseFloat(newTransactions.amount),
        date: new Date(newTransactions.date).toISOString(),
      });

      setNewTransactions({
        date: format(new Date(), "yyyy-MM-dd"),
        amount: "",
        category: "",
        description: "",
        type: "expense",
      });
      fetchTransactions();
      fetchSummaries();
    } catch (error) {
      console.error("Error adding transaction", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`);
      fetchTransactions();
      fetchSummaries();
    } catch (error) {
      console.error("Error deleting transactions", error);
    }
  };

  const importTransactions = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/transactions/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchTransactions();
      fetchSummaries();
    } catch (error) {
      console.error("Error importing transactions", error);
    }
  };

  const exportTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions/export`, {
        responseType: "blob",
      });
      saveAs(response.data, "transactions.csv");
    } catch (error) {
      console.error("Error exporting transactions", error);
    }
  };

  const monthlyChart = {
    labels: monthlySummary.map((item) =>
      format(parseISO(item.month), "MMM yyyy")
    ),
    datasets: [
      {
        label: "Income",
        data: monthlySummary.map((item) => Number(item.totalIncome) || 0),
        backgroundColor: "#10b981",
      },
      {
        label: "Expense",
        data: monthlySummary.map((item) => Number(item.totalExpense) || 0),
        backgroundColor: "#ef4444",
      },
    ],
  };

  const expenseCategory =
    categorySummary.filter((item) => item.type === "expense") || [];
  const categoryChart = {
    labels: expenseCategory.map((item) => item.category),
    datasets: [
      {
        data: expenseCategory.map((item) => item.total),
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#f59e0b",
          "#eab308",
          "#84cc16",
          "#22c55e",
          "#10b981",
          "#14b8a6",
          "#06b6d4",
          "#0ea5e9",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-4 md:p-10 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm">
          Finance Dashboard
        </h1>
        <p className="text-slate-500 mt-3 text-lg font-light">
          Track your income and expenses smartly
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
        {/* New Transaction Card */}
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">
            New Transaction
          </h2>
          <div className="space-y-5">
            {[
              { label: "Date", type: "date", key: "date" },
              { label: "Amount", type: "number", key: "amount" },
              { label: "Category", type: "text", key: "category" },
              { label: "Description", type: "text", key: "description" },
            ].map(({ label, type, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  className="w-full rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
                  value={newTransactions[key]}
                  onChange={(e) =>
                    setNewTransactions({
                      ...newTransactions,
                      [key]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Type
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 p-3 bg-slate-50 focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
                value={newTransactions.type}
                onChange={(e) =>
                  setNewTransactions({
                    ...newTransactions,
                    type: e.target.value,
                  })
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button
              onClick={addTransaction}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-xl flex items-center justify-center font-semibold text-lg shadow-md hover:shadow-lg transition"
            >
              <FiPlus className="mr-2" /> Add Transaction
            </button>
          </div>
        </div>

        {/* Monthly Summary Card */}
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">
            Monthly Summary
          </h2>
          <div className="h-64">
            <Bar
              data={monthlyChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
                plugins: {
                  legend: { labels: { font: { size: 14 } } },
                },
              }}
            />
          </div>
        </div>

        {/* Expenses by Category Card */}
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">
            Expenses by Category
          </h2>
          <div className="h-64">
            <Pie
              data={categoryChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { font: { size: 14 } },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* All Transactions Table */}
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-slate-700">
            All Transactions
          </h2>
          <div className="flex gap-3">
            <label className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-5 rounded-xl flex items-center cursor-pointer font-medium shadow-sm transition">
              <FiUpload className="mr-2" />
              Import
              <input
                type="file"
                accept=".csv"
                onChange={importTransactions}
                className="hidden"
              />
            </label>
            <button
              onClick={exportTransactions}
              className="bg-green-50 hover:bg-green-100 text-green-700 py-2 px-5 rounded-xl flex items-center font-medium shadow-sm transition"
            >
              <FiDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="min-w-full text-sm text-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Date",
                  "Amount",
                  "Category",
                  "Description",
                  "Type",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-xs"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : !Array.isArray(transactions) || transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, idx) => (
                  <tr
                    key={transaction.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white/70" : "bg-slate-50/70"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="px-5 py-3">
                      {format(parseISO(transaction.date), "MMM dd, yyyy")}
                    </td>
                    <td
                      className={`px-5 py-3 font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-5 py-3">{transaction.category}</td>
                    <td className="px-5 py-3">{transaction.description}</td>
                    <td className="px-5 py-3 capitalize">{transaction.type}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full p-2 transition"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
