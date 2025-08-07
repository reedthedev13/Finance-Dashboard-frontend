import { useEffect, useState } from "react";
import {
  getTransactions,
  getMonthlySummary,
  getCategorySummary,
  deleteTransaction,
} from "../services/api";
import Header from "../components/Header";
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

  const handleAddTransaction = async () => {
    try {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-4 md:p-10 font-sans">
      <Header />

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Transaction Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <TransactionForm onAddTransaction={handleAddTransaction} />
      </div>

      {/* Category charts*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <SummaryChart data={monthlySummary} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <CategoryChart data={categorySummary} />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <TransactionTable
          transactions={transactions}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default Dashboard;
