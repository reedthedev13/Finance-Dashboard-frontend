import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TransactionForm = ({ onAddTransaction }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [type, setType] = useState("income");
  const [date, setDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const transaction = {
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: date.toISOString(),
    };

    onAddTransaction(transaction);

    // Reset form
    setDescription("");
    setAmount("");
    setCategory("Other");
    setType("income");
    setDate(new Date());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 shadow p-4 sm:p-6 rounded-xl w-full max-w-md mx-auto mb-8"
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200 text-center">
        Add Transaction
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 px-3 py-2 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 px-3 py-2 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 px-3 py-2 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Food</option>
          <option>Housing</option>
          <option>Transportation</option>
          <option>Utilities</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>

        <DatePicker
          selected={date}
          onChange={(newDate) => setDate(newDate)}
          className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 px-3 py-2 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholderText="Select a date"
          dateFormat="yyyy-MM-dd"
        />

        <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 text-gray-900 dark:text-slate-100">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="income"
              checked={type === "income"}
              onChange={() => setType("income")}
              className="accent-blue-600 dark:accent-blue-400"
            />
            Income
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="expense"
              checked={type === "expense"}
              onChange={() => setType("expense")}
              className="accent-red-600 dark:accent-red-400"
            />
            Expense
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition text-sm sm:text-base"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
