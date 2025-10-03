// pages/admin/Staff.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchStaffs,
  addStaff,
  updateStaff,
  deleteStaff,
} from "../../store/staffSlice";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Staff() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.staff);

  // selection
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // filters
  const [filterName, setFilterName] = useState("");
  const [filterCode, setFilterCode] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterContact, setFilterContact] = useState("");

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: "",
    staffCode: "",
    role: "FullTime",
    contactNumber: "",
  });

  useEffect(() => {
    dispatch(fetchStaffs());
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
      setSelected(filtered.map((s) => s.staffId));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    selected.forEach((id) => dispatch(deleteStaff(id)));
    setSelected([]);
    setSelectAll(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.staffCode || !form.contactNumber) {
      alert("Please fill all fields");
      return;
    }
    if (editing) {
      await dispatch(updateStaff({ ...editing, ...form }));
    } else {
      await dispatch(addStaff(form));
    }
    setIsModalOpen(false);
    setEditing(null);
    setForm({ name: "", staffCode: "", role: "FullTime", contactNumber: "" });
  };

  const startEdit = (s: any) => {
    setEditing(s);
    setForm({
      name: s.name,
      staffCode: s.staffCode,
      role: s.role,
      contactNumber: s.contactNumber,
    });
    setIsModalOpen(true);
  };

  const filtered = list.filter((s) => {
    const matchName = filterName
      ? s.name.toLowerCase().includes(filterName.toLowerCase())
      : true;
    const matchCode = filterCode
      ? s.staffCode.toLowerCase().includes(filterCode.toLowerCase())
      : true;
    const matchRole = filterRole ? s.role === filterRole : true;
    const matchContact = filterContact
      ? s.contactNumber.includes(filterContact)
      : true;
    return matchName && matchCode && matchRole && matchContact;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Staff List
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

        {/* Add + Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEditing(null);
              setForm({
                name: "",
                staffCode: "",
                role: "FullTime",
                contactNumber: "",
              });
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 shadow"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add Staff
          </button>
          <input
            type="text"
            placeholder="Filter Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Filter Code"
            value={filterCode}
            onChange={(e) => setFilterCode(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Roles</option>
            <option value="FullTime">Full Time</option>
            <option value="PartTime">Part Time</option>
          </select>
          <input
            type="text"
            placeholder="Filter Contact"
            value={filterContact}
            onChange={(e) => setFilterContact(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <th className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={selectAll && filtered.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Staff Code</th>
              <th className="p-3">Role</th>
              <th className="p-3">Contact Number</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr
                key={s.staffId}
                className={`${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-indigo-50`}
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.staffId)}
                    onChange={() => toggleRow(s.staffId)}
                  />
                </td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.staffCode}</td>
                <td className="p-3">{s.role}</td>
                <td className="p-3">{s.contactNumber}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => startEdit(s)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <PencilIcon className="h-5 w-5 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
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
              {editing ? "Edit Staff" : "Add New Staff"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Staff Code"
                value={form.staffCode}
                onChange={(e) => setForm({ ...form, staffCode: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              >
                <option value="FullTime">Full Time</option>
                <option value="PartTime">Part Time</option>
              </select>
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
                {editing ? "Save Changes" : "Add Staff"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-gray-500 mt-4">Loading...</p>}
    </div>
  );
}
