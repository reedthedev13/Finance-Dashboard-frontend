const TransactionTable = ({ transactions, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
      <table className="min-w-full table-auto text-left text-sm text-slate-700">
        <thead className="bg-slate-100 text-slate-600 uppercase">
          <tr>
            <th className="p-2">Description</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Category</th>
            <th className="p-2">Type</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-t">
              <td className="p-2">{tx.description}</td>
              <td className="p-2">
                {tx.type === "expense" ? "-" : "+"}${tx.amount.toFixed(2)}
              </td>
              <td className="p-2">{tx.category}</td>
              <td className="p-2">{tx.type}</td>
              <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="p-2">
                <button
                  onClick={() => onDelete(tx._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
