import { useState } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";

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
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Transactions
      </h2>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        {/* Delete button */}
        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className={`flex items-center px-4 py-2 rounded-lg font-semibold text-white shadow ${
            selected.length > 0
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <TrashIcon className="h-5 w-5 mr-1" />
          Delete Selected
        </button>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Filter by Staff ID"
            value={filterStaffId}
            onChange={(e) => setFilterStaffId(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Filter by Alpha"
            value={filterAlpha}
            onChange={(e) => setFilterAlpha(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-left">
              <th className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={selectAll && filteredData.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Staff ID</th>
              <th className="p-3">Driver Name</th>
              <th className="p-3">Alpha</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr
                key={row.id}
                className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50 transition-colors`}
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </td>
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.staffId}</td>
                <td className="p-3">{row.driver}</td>
                <td className="p-3">{row.alpha}</td>
                <td className="p-3 text-center">
                  <button className="text-indigo-600 hover:text-indigo-800" title="View PDF">
                    <EyeIcon className="h-5 w-5 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
