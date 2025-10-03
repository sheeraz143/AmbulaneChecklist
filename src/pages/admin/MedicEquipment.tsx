// pages/admin/MedicEquipment.tsx
import { useEffect, useState } from "react";
import {
  fetchMedicEquipment,
  addMedicEquipment,
  updateMedicEquipment,
  deleteMedicEquipment,
  MedicEquipment,
} from "../../store/medicEquipmentSlice";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toast } from "react-toastify";

export default function MedicEquipmentPage() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.medicEquipment);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MedicEquipment | null>(null);
  const [name, setName] = useState("");

  // ✅ Filters
  const [filterName, setFilterName] = useState("");

  // ✅ Selection
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    dispatch(fetchMedicEquipment());
  }, [dispatch]);

  // ✅ Save (add or update)
  const handleSave = async () => {
    if (!name.trim()) return alert("Please enter equipment name");

    // if (editItem) {
    //   await dispatch(updateMedicEquipment({ id: editItem.medicEquipmentId, name }));
    // } else {
    //   await dispatch(addMedicEquipment({ name }));
    // }

    const result = await dispatch(addMedicEquipment({ name }));
    toast.success("Equipment added successfully");


    if (addMedicEquipment.fulfilled.match(result)) {
      await dispatch(fetchMedicEquipment()); // ⬅️ reload from backend
    }

    setIsModalOpen(false);
    setName("");
    setEditItem(null);
    setSelected([]);
  };

  // ✅ Delete selected
  const handleDeleteSelected = async () => {
    if (!window.confirm("Delete selected items?")) return;
    for (const id of selected) {
      await dispatch(deleteMedicEquipment(id));
    }
    setSelected([]);
    setSelectAll(false);
  };

  // ✅ Select toggles
  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredData.map((item) => item.medicEquipmentId));
    }
    setSelectAll(!selectAll);
  };

  // ✅ Filtered Data (from Redux list)
  const filteredData = list.filter((item) =>
    filterName ? item.name.toLowerCase().includes(filterName.toLowerCase()) : true
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Medic Equipment
      </h2>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        {/* Delete Selected */}
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

        {/* Add + Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setEditItem(null);
              setName("");
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 shadow"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add Equipment
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
              <th className="p-3">Name</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, i) => (
                <tr
                  key={item.medicEquipmentId}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.medicEquipmentId)}
                      onChange={() => toggleRow(item.medicEquipmentId)}
                    />
                  </td>
                  <td className="p-3">{item.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-500">
                  No equipment found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              {editItem ? "Edit Equipment" : "Add New Equipment"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Equipment Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditItem(null);
                  setName("");
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow"
              >
                {editItem ? "Save Changes" : "Add Equipment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
