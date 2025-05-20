import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format, parseISO } from "date-fns";
import { FiUpload, FiDownload, FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { saveAs } from "file-saver";
import "./index.css";

Chart.register(...registerables);

const API_URL = "http://localhost:8080/api";

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
    <div className="min-h-screen bg-gradient-to-r from-slate-100 to-slate-200 p-6 md:p-12 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800">
          Finance Dashboard
        </h1>
        <p className="text-slate-600 mt-2">
          Track your income and expenses smartly
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Transaction Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-4">
            New Transaction
          </h2>
          <div className="space-y-4">
            {[
              { label: "Date", type: "date", key: "date" },
              { label: "Amount", type: "number", key: "amount" },
              { label: "Category", type: "text", key: "category" },
              { label: "Description", type: "text", key: "description" },
            ].map(({ label, type, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-600">
                  {label}
                </label>
                <input
                  type={type}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-slate-600">
                Type
              </label>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition"
            >
              <FiPlus className="mr-2" /> Add Transaction
            </button>
          </div>
        </div>

        {/* Monthly Summary Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-4">
            Monthly Summary
          </h2>
          <div className="h-64">
            <Bar
              data={monthlyChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-4">
            Expenses by Category
          </h2>
          <div className="h-64">
            <Pie
              data={categoryChart}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-700">All Transactions</h2>
          <div className="flex gap-2">
            <label className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-md flex items-center cursor-pointer">
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
              className="bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-md flex items-center"
            >
              <FiDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <thead className="bg-slate-100">
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
                    className="px-4 py-2 text-left font-semibold uppercase tracking-wider text-xs"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : !Array.isArray(transactions) || transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2">
                      {format(parseISO(transaction.date), "MMM dd, yyyy")}
                    </td>
                    <td
                      className={`px-4 py-2 ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{transaction.category}</td>
                    <td className="px-4 py-2">{transaction.description}</td>
                    <td className="px-4 py-2 capitalize">{transaction.type}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-900"
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
