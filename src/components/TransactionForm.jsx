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
      className="bg-white shadow p-6 rounded-xl max-w-md w-full mx-auto mb-8"
    >
      <h2 className="text-xl font-semibold mb-4 text-slate-700">
        Add Transaction
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
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
          className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholderText="Select a date"
          dateFormat="yyyy-MM-dd"
        />

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="income"
              checked={type === "income"}
              onChange={() => setType("income")}
            />
            Income
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="expense"
              checked={type === "expense"}
              onChange={() => setType("expense")}
            />
            Expense
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
