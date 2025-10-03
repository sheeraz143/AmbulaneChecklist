import { useEffect, useState } from "react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchLighting,
  addLighting,
  updateLighting,
  deleteLighting,
} from "../../store/lightingSlice";
import { set } from "react-hook-form";

type LightingItem = {
  lightingAndElectricalId: number;
  name: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
};

export default function Lighting() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.lighting);

  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Filters
  const [filterName, setFilterName] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LightingItem | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    dispatch(fetchLighting());
  }, [dispatch, refresh]);

  // Filtered list
  const filteredData = list.filter((row) =>
    filterName ? row.name.toLowerCase().includes(filterName.toLowerCase()) : true
  );

  // Select all toggle
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredData.map((row) => row.lightingAndElectricalId));
    }
    setSelectAll(!selectAll);
  };

  // Toggle row selection
  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Delete selected
  const handleDeleteSelected = () => {
    selected.forEach((id) => dispatch(deleteLighting(id)));
    setSelected([]);
    setSelectAll(false);
  };

  // Add or update
  const handleSave = async () => {
    if (!newName.trim()) {
      alert("Please enter a name");
      return;
    }
    // dispatch(addLighting(newName));




    setNewName("");
    setEditingItem(null);
    setIsModalOpen(false);
    // setRefresh(!refresh);
    const result = await dispatch(addLighting(newName));

    if (addLighting.fulfilled.match(result)) {
      await dispatch(fetchLighting()); // ⬅️ reload from backend
    }
  };

  // Start edit
  const startEdit = (item: LightingItem) => {
    setEditingItem(item);
    setNewName(item.name);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Lighting & Electrical
      </h2>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        {/* Left: Delete button */}
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

        {/* Right: Add button + Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEditingItem(null);
              setNewName("");
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 shadow"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add Lighting
          </button>
          <input
            type="text"
            placeholder="Filter Name"
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
              {/* <th className="p-3">ID</th> */}
              <th className="p-3">Lighting Name</th>

            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr
                key={row.lightingAndElectricalId}
                className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50`}
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.lightingAndElectricalId)}
                    onChange={() => toggleRow(row.lightingAndElectricalId)}
                  />
                </td>
                {/* <td className="p-3">{row.lightingAndElectricalId}</td> */}
                <td className="p-3">{row.name}</td>

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

      {loading && <p className="mt-4 text-gray-500">Loading...</p>}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              {editingItem ? "Edit Lighting" : "Add Lighting"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Lighting Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow"
              >
                {editingItem ? "Save Changes" : "Add Lighting"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
