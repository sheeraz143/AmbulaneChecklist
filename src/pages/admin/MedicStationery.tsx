// pages/admin/MedicStationery.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchMedicStationery,
  addMedicStationery,
  updateMedicStationery,
  deleteMedicStationery,
} from "../../store/medicStationerySlice";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";

type StationeryRow = {
  id: number;
  name: string;
};

export default function MedicStationery() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.medicStationery);

  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filters
  const [filterName, setFilterName] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<StationeryRow | null>(null);
  const [newRow, setNewRow] = useState<StationeryRow>({ id: 0, name: "" });

  useEffect(() => {
    dispatch(fetchMedicStationery());
  }, [dispatch]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredData.map((row) => row.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    selected.forEach((id) => dispatch(deleteMedicStationery(id)));
    setSelected([]);
    setSelectAll(false);
  };

  const handleSave = async () => {
    if (!newRow.name.trim()) {
      alert("Stationery name is required");
      return;
    }

    // if (editingRow) {
    //   dispatch(updateMedicStationery({ id: editingRow.id, name: newRow.name }));
    // } else {
    //   dispatch(addMedicStationery({ name: newRow.name }));
    // }
    const result = await dispatch(addMedicStationery({ name: newRow.name }));

    if (addMedicStationery.fulfilled.match(result)) {
      await dispatch(fetchMedicStationery()); // ⬅️ reload from backend
    }

    setNewRow({ id: 0, name: "" });
    setEditingRow(null);
    setIsModalOpen(false);
  };

  const startEdit = (row: StationeryRow) => {
    setEditingRow(row);
    setNewRow(row);
    setIsModalOpen(true);
  };

  const filteredData = list
    .map((m) => ({ id: m.medicStationeryId, name: m.name }))
    .filter((row) =>
      filterName ? row.name.toLowerCase().includes(filterName.toLowerCase()) : true
    );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Medic Stationery
      </h2>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className={`px-4 py-2 rounded-lg text-white font-semibold ${selected.length > 0
            ? "bg-red-600 hover:bg-red-700 shadow"
            : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Delete Selected
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEditingRow(null);
              setNewRow({ id: 0, name: "" });
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 shadow"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add Stationery
          </button>
          <input
            type="text"
            placeholder="Filter by name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
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
              {/* <th className="p-3">Stationery ID</th> */}
              <th className="p-3">Stationery Name</th>
              {/* <th className="p-3 text-center">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr
                key={row.id}
                className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50`}
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </td>
                {/* <td className="p-3">{row.id}</td> */}
                <td className="p-3">{row.name}</td>
                {/* <td className="p-3 text-center">
                  <button
                    onClick={() => startEdit(row)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5 inline-block" />
                  </button>
                </td> */}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <p className="text-gray-500 mt-4">Loading...</p>}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              {editingRow ? "Edit Stationery" : "Add New Stationery"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Stationery Name"
                value={newRow.name}
                onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingRow(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow"
              >
                Add Stationery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
