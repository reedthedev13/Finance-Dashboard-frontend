import Papa from "papaparse";

export default function CSVImport({ onImport }) {
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

  return (
    <div className="flex items-center justify-center">
      <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition">
        Import CSV
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
}
