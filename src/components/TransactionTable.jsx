const TransactionTable = ({ transactions, onDelete }) => {
  return (
    <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Transactions
      </h2>

      {!transactions || transactions.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400 text-center">
          No transactions available
        </p>
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
