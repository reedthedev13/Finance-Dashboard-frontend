const TransactionTable = ({ transactions, onDelete }) => {
  return (
    <div className="mt-6 bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold text-slate-700 mb-2">
        Transactions
      </h2>
      {!transactions || transactions.length === 0 ? (
        <p className="text-gray-500 text-center">No transactions available</p>
      ) : (
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
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
              <tr key={tx.id} className="border-b">
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
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionTable;
