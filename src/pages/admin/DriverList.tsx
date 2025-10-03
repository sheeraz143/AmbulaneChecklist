import { useEffect, useState } from "react";
import {
  fetchDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  Driver,
} from "../../store/driverSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function DriverList() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.driver);

  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [newDriver, setNewDriver] = useState<Omit<Driver, "driverId" | "createdDate" | "updatedDate">>({
    name: "",
    driverCode: "",
    role: "FullTime",
    contactNumber: "",
    licenseNumber: "",
    isActive: true,
  });

  // Filters
  const [filterCode, setFilterCode] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [filterLicense, setFilterLicense] = useState("");

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch, refresh]);

  // ✅ Tell TS list is Driver[]
  const filteredData: Driver[] = list.filter((row: Driver) => {
    const matchesCode = filterCode
      ? row.driverCode.toLowerCase().includes(filterCode.toLowerCase())
      : true;
    const matchesName = filterName
      ? row.name.toLowerCase().includes(filterName.toLowerCase())
      : true;
    const matchesMobile = filterMobile
      ? row.contactNumber.includes(filterMobile)
      : true;
    const matchesLicense = filterLicense
      ? row.licenseNumber.toLowerCase().includes(filterLicense.toLowerCase())
      : true;
    return matchesCode && matchesName && matchesMobile && matchesLicense;
  });

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredData.map((row: Driver) => row.driverId));
    }
    setSelectAll(!selectAll);
  };

  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    selected.forEach((id) => dispatch(deleteDriver(id)));
    setSelected([]);
    setSelectAll(false);
  };

  const handleSaveDriver = async () => {
    if (
      !newDriver.name ||
      !newDriver.driverCode ||
      !newDriver.contactNumber ||
      !newDriver.licenseNumber
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingDriver) {
      await dispatch(
        updateDriver({ id: editingDriver.driverId, ...newDriver })
      );
    } else {
      await dispatch(addDriver(newDriver));
      setRefresh(!refresh);
    }

    setNewDriver({
      name: "",
      driverCode: "",
      role: "FullTime",
      contactNumber: "",
      licenseNumber: "",
      isActive: true,
    });
    setEditingDriver(null);
    setIsModalOpen(false);
  };

  const startEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setNewDriver({
      name: driver.name,
      driverCode: driver.driverCode,
      role: driver.role,
      contactNumber: driver.contactNumber,
      licenseNumber: driver.licenseNumber,
      isActive: driver.isActive,
    });
    setIsModalOpen(true);
  };


  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Driver List
      </h2>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className={`px-4 py-2 rounded-lg text-white font-semibold ${selected.length > 0 ? "bg-red-600 hover:bg-red-700 shadow" : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Delete Selected
        </button>

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
            placeholder="Filter Code"
            value={filterCode}
            onChange={(e) => setFilterCode(e.target.value)}
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
              <th className="p-3">Code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">License No</th>
              <th className="p-3">Role</th>
              {/* <th className="p-3 text-center">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr key={row.driverId} className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50`}>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.driverId)}
                    onChange={() => toggleRow(row.driverId)}
                  />
                </td>
                <td className="p-3">{row.driverCode}</td>
                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.contactNumber}</td>
                <td className="p-3">{row.licenseNumber}</td>
                <td className="p-3">{row.role}</td>
                {/* <td className="p-3 text-center">
                  <button
                    onClick={() => startEdit(row)}
                    className="text-indigo-600 hover:text-indigo-800 mr-2"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5 inline-block" />
                  </button>
                </td> */}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
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
              {editingDriver ? "Edit Driver" : "Add New Driver"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Driver Code"
                value={newDriver.driverCode}
                onChange={(e) => setNewDriver({ ...newDriver, driverCode: e.target.value })}
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
                placeholder="Contact Number"
                value={newDriver.contactNumber}
                onChange={(e) => setNewDriver({ ...newDriver, contactNumber: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="License Number"
                value={newDriver.licenseNumber}
                onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              />
              <select
                value={newDriver.role}
                onChange={(e) => setNewDriver({ ...newDriver, role: e.target.value })}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-400"
              >
                <option value="FullTime">Full Time</option>
                <option value="PartTime">Part Time</option>
              </select>
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
