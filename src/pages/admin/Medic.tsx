import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchMedics,
  addMedic,
  updateMedic,
  deleteMedic,
} from "../../store/medicSlice";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Medic() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.medic);

  // selection
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // unified search
  const [globalSearch, setGlobalSearch] = useState("");

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: "",
    medicCode: "",
    contactNumber: "",
  });

  useEffect(() => {
    dispatch(fetchMedics());
  }, [dispatch]);

  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filtered.map((m) => m.medicId));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    selected.forEach((id) => dispatch(deleteMedic(id)));
    setSelected([]);
    setSelectAll(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.medicCode || !form.contactNumber) {
      alert("Please fill all fields");
      return;
    }

    const result = await dispatch(addMedic(form));
    if (addMedic.fulfilled.match(result)) {
      await dispatch(fetchMedics());
    }

    setIsModalOpen(false);
    setEditing(null);
    setForm({ name: "", medicCode: "", contactNumber: "" });
  };

  const startEdit = (m: any) => {
    setEditing(m);
    setForm({
      name: m.name,
      medicCode: m.medicCode,
      contactNumber: m.contactNumber,
    });
    setIsModalOpen(true);
  };

  // ✅ Unified search filter
  const filtered = list.filter((m) => {
    if (!globalSearch.trim()) return true;
    const q = globalSearch.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.medicCode.toLowerCase().includes(q) ||
      m.contactNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Medic List
      </h2>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        {/* Delete */}
        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className={`px-4 py-2 rounded-lg text-white font-semibold ${
            selected.length > 0
              ? "bg-red-600 hover:bg-red-700 shadow"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Delete Selected
        </button>

        {/* Add + Unified Filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => {
              setEditing(null);
              setForm({ name: "", medicCode: "", contactNumber: "" });
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 shadow"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add Medic
          </button>

          {/* ✅ Unified search bar */}
          <input
            type="text"
            placeholder="Search by Name, Code, or Contact..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="border p-2 rounded-lg text-sm w-72 focus:ring-2 focus:ring-indigo-400"
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
                  checked={selectAll && filtered.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-3">Medic Name</th>
              <th className="p-3">Medic Code</th>
              <th className="p-3">Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((m, i) => (
                <tr
                  key={m.medicId}
                  className={`${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(m.medicId)}
                      onChange={() => toggleRow(m.medicId)}
                    />
                  </td>
                  <td className="p-3">{m.name}</td>
                  <td className="p-3">{m.medicCode}</td>
                  <td className="p-3">{m.contactNumber}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No records found
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
              {editing ? "Edit Medic" : "Add New Medic"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Medic Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Medic Code"
                value={form.medicCode}
                onChange={(e) =>
                  setForm({ ...form, medicCode: e.target.value })
                }
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={form.contactNumber}
                onChange={(e) =>
                  setForm({ ...form, contactNumber: e.target.value })
                }
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditing(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow"
              >
                {editing ? "Save Changes" : "Add Medic"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-gray-500 mt-4">Loading...</p>}
    </div>
  );
}
