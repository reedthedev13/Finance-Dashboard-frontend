import Papa from "papaparse";

export default function CSVImport({ onImport, transactions = [] }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validData = results.data
          .map((row) => ({
            description: row.description || "",
            amount: parseFloat(row.amount),
            category: row.category || "Other",
            type: row.type?.toLowerCase() === "expense" ? "expense" : "income",
            date: row.date
              ? new Date(row.date).toISOString()
              : new Date().toISOString(),
          }))
          .filter((tx) => !isNaN(tx.amount));

        onImport(validData);
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
        alert("Failed to read CSV file. Please check your format.");
      },
    });
  };

  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }

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
    <div className="flex items-center justify-center gap-2">
      <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition">
        Import CSV
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      <button
        onClick={handleExport}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Export CSV
      </button>
    </div>
  );
}
