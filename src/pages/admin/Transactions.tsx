
// pages/admin/Transactions.tsx
import { useEffect, useState } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchTransactions,
  deleteTransaction,
  Transaction,
} from "../../store/transactionSlice";

export default function Transactions() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.transactions);

  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState("");
  const [filterStaffId, setFilterStaffId] = useState("");
  const [filterAlpha, setFilterAlpha] = useState("");

  // Load on mount
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Filtered data
  const filteredData = list.filter((row: Transaction) => {
    const matchesDate = filterDate ? row.transactionDate.startsWith(filterDate) : true;
    const matchesStaff = filterStaffId
      ? row.driverCode?.toLowerCase().includes(filterStaffId.toLowerCase()) ||
        row.medicCode?.toLowerCase().includes(filterStaffId.toLowerCase())
      : true;
    const matchesAlpha = filterAlpha
      ? row.vehicleNumber.toLowerCase().includes(filterAlpha.toLowerCase())
      : true;
    return matchesDate && matchesStaff && matchesAlpha;
  });

  // Select toggles
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredData.map((row) => row.masterId));
    }
    setSelectAll(!selectAll);
  };
  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Delete selected
  const handleDeleteSelected = () => {
    selected.forEach((id) => dispatch(deleteTransaction(id)));
    setSelected([]);
    setSelectAll(false);
  };

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
            placeholder="Filter by Staff Code"
            value={filterStaffId}
            onChange={(e) => setFilterStaffId(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Filter by Vehicle"
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
              <th className="p-3">Vehicle</th>
              <th className="p-3">Driver</th>
              <th className="p-3">Medic</th>
              {/* <th className="p-3 text-center">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, i) => (
                <tr
                  key={row.masterId}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50 transition-colors`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(row.masterId)}
                      onChange={() => toggleRow(row.masterId)}
                    />
                  </td>
                  <td className="p-3">
                    {new Date(row.transactionDate).toLocaleString("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="p-3">{row.vehicleNumber}</td>
                  <td className="p-3">{row.driverName}</td>
                  <td className="p-3">{row.medicName}</td>
                  {/* <td className="p-3 text-center">
                    <button
                      className="text-indigo-600 hover:text-indigo-800"
                      title="View PDF"
                    >
                      <EyeIcon className="h-5 w-5 inline-block" />
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
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
