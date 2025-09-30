import { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

type Driver = {
  id: number;
  staffId: string;
  name: string;
  mobile: string;
  license: string;
};

export default function DriverList() {
  const [data, setData] = useState<Driver[]>([
    { id: 1, staffId: "S101", name: "Alex Johnson", mobile: "9876543210", license: "LIC001" },
    { id: 2, staffId: "S102", name: "Emma Watson", mobile: "9123456780", license: "LIC002" },
  ]);

  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filters
  const [filterStaffId, setFilterStaffId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [filterLicense, setFilterLicense] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [newDriver, setNewDriver] = useState<Driver>({
    id: 0,
    staffId: "",
    name: "",
    mobile: "",
    license: "",
  });

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
    const matchesStaff = filterStaffId
      ? row.staffId.toLowerCase().includes(filterStaffId.toLowerCase())
      : true;
    const matchesName = filterName
      ? row.name.toLowerCase().includes(filterName.toLowerCase())
      : true;
    const matchesMobile = filterMobile
      ? row.mobile.includes(filterMobile)
      : true;
    const matchesLicense = filterLicense
      ? row.license.toLowerCase().includes(filterLicense.toLowerCase())
      : true;
    return matchesStaff && matchesName && matchesMobile && matchesLicense;
  });

  // Add or edit driver
  const handleSaveDriver = () => {
    if (!newDriver.staffId || !newDriver.name || !newDriver.mobile || !newDriver.license) {
      alert("Please fill all fields");
      return;
    }

    if (editingDriver) {
      // Update existing
      setData((prev) =>
        prev.map((d) => (d.id === editingDriver.id ? { ...newDriver, id: editingDriver.id } : d))
      );
    } else {
      // Add new
      const driverToAdd = { ...newDriver, id: Date.now() };
      setData((prev) => [...prev, driverToAdd]);
    }

    setNewDriver({ id: 0, staffId: "", name: "", mobile: "", license: "" });
    setEditingDriver(null);
    setIsModalOpen(false);
  };

  const startEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setNewDriver(driver);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Driver List
      </h2>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        {/* Left: Delete button */}
        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className={`px-4 py-2 rounded-lg text-white font-semibold ${
            selected.length > 0 ? "bg-red-600 hover:bg-red-700 shadow" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Delete Selected
        </button>

        {/* Right: Add button + Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEditingDriver(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 shadow"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add Driver
          </button>
          <input
            type="text"
            placeholder="Filter Staff ID"
            value={filterStaffId}
            onChange={(e) => setFilterStaffId(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Filter Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Filter Mobile"
            value={filterMobile}
            onChange={(e) => setFilterMobile(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Filter License"
            value={filterLicense}
            onChange={(e) => setFilterLicense(e.target.value)}
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
              <th className="p-3">Staff ID</th>
              <th className="p-3">Driver Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">License No</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr key={row.id} className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50`}>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </td>
                <td className="p-3">{row.staffId}</td>
                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.mobile}</td>
                <td className="p-3">{row.license}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => startEdit(row)}
                    className="text-indigo-600 hover:text-indigo-800 mr-2"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5 inline-block" />
                  </button>
                  <button
                    onClick={() => {
                      setSelected([row.id]);
                      handleDeleteSelected();
                    }}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5 inline-block" />
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

      {/* Modal Popup for Add/Edit Driver */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              {editingDriver ? "Edit Driver" : "Add New Driver"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Staff ID"
                value={newDriver.staffId}
                onChange={(e) => setNewDriver({ ...newDriver, staffId: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Driver Name"
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Mobile"
                value={newDriver.mobile}
                onChange={(e) => setNewDriver({ ...newDriver, mobile: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="License No"
                value={newDriver.license}
                onChange={(e) => setNewDriver({ ...newDriver, license: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingDriver(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDriver}
                className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow"
              >
                {editingDriver ? "Save Changes" : "Add Driver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
