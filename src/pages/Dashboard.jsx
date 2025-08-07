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

  return (
    <>
      <TransactionForm onAddTransaction={handleAddTransaction} />
      <SummaryChart data={monthlySummary} />
      <CategoryChart data={categorySummary} />
      <TransactionTable
        transactions={transactions}
        onDelete={handleDeleteTransaction}
      />
    </>
  );
};

export default Dashboard;
