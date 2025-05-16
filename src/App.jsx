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
    labels: monthlySummary?.map((item) => item.month) || [],
    datasets: [
      {
        label: "Income",
        data: monthlySummary?.map((item) => item.totalIncome) || [],
        backgroundColor: "#10b981",
      },
      {
        label: "Expense",
        data: monthlySummary?.map((item) => item.totalExpense) || [],
        backgroundColor: "#ef4444",
      },
    ],
  };

  const expenseCategory =
    categorySummary?.filter((item) => item.type === "expense") || [];
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Personal Finance Dashboard
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={newTransactions.date}
                onChange={(e) =>
                  setNewTransactions({
                    ...newTransactions,
                    date: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={newTransactions.amount}
                onChange={(e) =>
                  setNewTransactions({
                    ...newTransactions,
                    amount: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={newTransactions.category}
                onChange={(e) =>
                  setNewTransactions({
                    ...newTransactions,
                    category: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={newTransactions.description}
                onChange={(e) =>
                  setNewTransactions({
                    ...newTransactions,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
            >
              <FiPlus className="mr-2" /> Add Transaction
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
          <div className="h-64">
            <Bar
              data={monthlyChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
          <div className="h-64">
            <Pie
              data={categoryChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transactions</h2>
          <div className="flex space-x-2">
            <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md flex items-center justify-center cursor-pointer">
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
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md flex items-center justify-center"
            >
              <FiDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : !transactions || transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(parseISO(transaction.date), "MMM dd, yyyy")}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        transaction.type === "income"
                          ? "text-income"
                          : "text-expense"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
