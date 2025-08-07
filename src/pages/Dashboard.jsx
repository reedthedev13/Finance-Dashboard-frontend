import { useEffect, useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  getTransactions,
  getMonthlySummary,
  getCategorySummary,
  deleteTransaction,
  addTransaction,
} from "../services/api";
import CategoryChart from "../components/CategoryChart";
import SummaryChart from "../components/SummaryChart";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [tx, ms, cs] = await Promise.all([
        getTransactions(),
        getMonthlySummary(),
        getCategorySummary(),
      ]);
      setTransactions(tx.data);
      setMonthlySummary(ms.data);
      setCategorySummary(cs.data);
    } catch (err) {
      console.error("Error loading dashboard", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddTransaction = async (newTransaction) => {
    try {
      await addTransaction(newTransaction);
      await fetchAllData();
    } catch (err) {
      console.error("Error adding transaction", err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      await fetchAllData();
    } catch (err) {
      console.error("Error deleting transaction", err);
    }
  };

  const filteredTransactions = (transactions || [])
    .filter(
      (tx) =>
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-10 font-sans space-y-5 flex-col">
      <TransactionForm onAddTransaction={handleAddTransaction} />

      <SummaryChart data={monthlySummary} />
      <CategoryChart data={categorySummary} />

      {/* Search Input */}
      <div className="mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search description or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-md"
        />
      </div>

      {/* Sort Controls */}
      <div className="mb-4 max-w-md mx-auto flex gap-2 items-center text-gray-900 dark:text-gray-100">
        <label>Sort by:</label>
        <select
          value={sortConfig.key}
          onChange={(e) =>
            setSortConfig((prev) => ({ ...prev, key: e.target.value }))
          }
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 rounded"
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="category">Category</option>
          <option value="description">Description</option>
        </select>

        <button
          onClick={() =>
            setSortConfig((prev) => ({
              ...prev,
              direction: prev.direction === "asc" ? "desc" : "asc",
            }))
          }
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          {sortConfig.direction === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <TransactionTable
        transactions={filteredTransactions}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};

export default Dashboard;
