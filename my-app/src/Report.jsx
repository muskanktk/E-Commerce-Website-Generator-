// src/pages/Report.jsx
export default function Report({ salesData = [] }) {
  const total = salesData.reduce((acc, s) => acc + (s.amount || 0), 0);
  return (
    <main className="pt-20 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Earnings Report</h1>
      <p className="text-lg font-semibold mb-6">Total: ${total.toFixed(2)}</p>
      <div className="rounded border overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((s, i) => (
              <tr key={i}>
                <td className="border p-2">{s.date}</td>
                <td className="border p-2">{s.item}</td>
                <td className="border p-2">${Number(s.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
            {salesData.length === 0 && (
              <tr>
                <td className="border p-2" colSpan={3}>No sales yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
