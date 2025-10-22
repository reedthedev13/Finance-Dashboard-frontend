import { FilePlus2 } from "lucide-react"; // empty state icon
import Papa from "papaparse";

const TransactionTable = ({ transactions, onDelete }) => {
  const hasNoTransactions = !transactions || transactions.length === 0;

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) return;

    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow p-4 sm:p-6 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          Transactions
        </h2>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1 text-sm px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-sm"
        >
          Export CSV
        </button>
      </div>

      {hasNoTransactions ? (
        // 💡 Empty State
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 dark:text-slate-400">
          <FilePlus2 className="w-12 h-12 mb-3 text-slate-400 dark:text-slate-500" />
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
            No transactions yet
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add your first income or expense to start tracking.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="hidden md:table w-full text-sm text-left text-gray-600 dark:text-slate-300">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-400">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-200 dark:border-slate-700"
                >
                  <td className="px-4 py-2">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{tx.category}</td>
                  <td className="px-4 py-2">${tx.amount}</td>
                  <td className="px-4 py-2 capitalize">{tx.type}</td>
                  <td className="px-4 py-2">{tx.description}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      aria-label="Delete transaction"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4 text-gray-700 dark:text-slate-300"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{tx.category}</span>
                  <span
                    className={`text-sm font-medium ${
                      tx.type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>
                <p className="text-sm mb-1">
                  <span className="font-medium">Amount: </span>${tx.amount}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">Date: </span>
                  {new Date(tx.date).toLocaleDateString()}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Description: </span>
                  {tx.description}
                </p>
                <button
                  onClick={() => onDelete(tx.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm"
                  aria-label="Delete transaction"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
