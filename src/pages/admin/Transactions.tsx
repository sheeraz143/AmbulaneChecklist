import { useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

type Transaction = {
  id: number;
  date: string;
  staffId: string;
  driver: string;
  alpha: string;
};

export default function Transactions() {
  const [data, setData] = useState<Transaction[]>([
    { id: 1, date: "2025-09-23 10:30", staffId: "S123", driver: "John Doe", alpha: "A1" },
    { id: 2, date: "2025-09-23 11:00", staffId: "S124", driver: "Jane Smith", alpha: "A2" },
    { id: 3, date: "2025-09-24 09:15", staffId: "S125", driver: "Mark Lee", alpha: "A1" },
  ]);

  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState("");
  const [filterStaffId, setFilterStaffId] = useState("");
  const [filterAlpha, setFilterAlpha] = useState("");

  // Select all toggle
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredData.map((row) => row.id));
    }
    setSelectAll(!selectAll);
  };

  // Toggle row checkbox
  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Delete selected rows
  const handleDeleteSelected = () => {
    setData((prev) => prev.filter((row) => !selected.includes(row.id)));
    setSelected([]);
    setSelectAll(false);
  };

  // Apply filters
  const filteredData = data.filter((row) => {
    const matchesDate = filterDate ? row.date.startsWith(filterDate) : true;
    const matchesStaff = filterStaffId
      ? row.staffId.toLowerCase().includes(filterStaffId.toLowerCase())
      : true;
    const matchesAlpha = filterAlpha
      ? row.alpha.toLowerCase().includes(filterAlpha.toLowerCase())
      : true;
    return matchesDate && matchesStaff && matchesAlpha;
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transactions</h2>

      {/* Filter + Delete Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        {/* Left: Delete button */}
        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className={`px-4 py-2 rounded text-white ${
            selected.length > 0 ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Delete Selected
        </button>

        {/* Right: Filters */}
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Filter by Staff ID"
            value={filterStaffId}
            onChange={(e) => setFilterStaffId(e.target.value)}
            className="border p-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Filter by Alpha"
            value={filterAlpha}
            onChange={(e) => setFilterAlpha(e.target.value)}
            className="border p-2 rounded text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full border border-black text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-black p-2 text-center">
              <input
                type="checkbox"
                checked={selectAll && filteredData.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="border border-black p-2">Date & Time</th>
            <th className="border border-black p-2">Staff ID</th>
            <th className="border border-black p-2">Driver Name</th>
            <th className="border border-black p-2">Alpha</th>
            <th className="border border-black p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row.id}>
              <td className="border border-black p-2 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(row.id)}
                  onChange={() => toggleRow(row.id)}
                />
              </td>
              <td className="border border-black p-2">{row.date}</td>
              <td className="border border-black p-2">{row.staffId}</td>
              <td className="border border-black p-2">{row.driver}</td>
              <td className="border border-black p-2">{row.alpha}</td>
              <td className="border border-black p-2 text-center">
                <button className="text-blue-600" title="View PDF">
                  <EyeIcon className="h-5 w-5 inline-block" />
                </button>
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
