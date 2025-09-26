import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

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

  // Add new driver
  const handleAddDriver = () => {
    if (!newDriver.staffId || !newDriver.name || !newDriver.mobile || !newDriver.license) {
      alert("Please fill all fields");
      return;
    }
    const driverToAdd = { ...newDriver, id: Date.now() };
    setData((prev) => [...prev, driverToAdd]);
    setNewDriver({ id: 0, staffId: "", name: "", mobile: "", license: "" });
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Driver List</h2>

      {/* Top Actions */}
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

        {/* Right: Add button + Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add Driver
          </button>
          <input
            type="text"
            placeholder="Filter by Staff ID"
            value={filterStaffId}
            onChange={(e) => setFilterStaffId(e.target.value)}
            className="border p-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Filter by Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="border p-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Filter by Mobile"
            value={filterMobile}
            onChange={(e) => setFilterMobile(e.target.value)}
            className="border p-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Filter by License"
            value={filterLicense}
            onChange={(e) => setFilterLicense(e.target.value)}
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
            <th className="border border-black p-2">Staff ID</th>
            <th className="border border-black p-2">Driver Name</th>
            <th className="border border-black p-2">Mobile</th>
            <th className="border border-black p-2">License No</th>
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
              <td className="border border-black p-2">{row.staffId}</td>
              <td className="border border-black p-2">{row.name}</td>
              <td className="border border-black p-2">{row.mobile}</td>
              <td className="border border-black p-2">{row.license}</td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Popup for Add Driver */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Add New Driver</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Staff ID"
                value={newDriver.staffId}
                onChange={(e) => setNewDriver({ ...newDriver, staffId: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Driver Name"
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Mobile"
                value={newDriver.mobile}
                onChange={(e) => setNewDriver({ ...newDriver, mobile: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="License No"
                value={newDriver.license}
                onChange={(e) => setNewDriver({ ...newDriver, license: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDriver}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
