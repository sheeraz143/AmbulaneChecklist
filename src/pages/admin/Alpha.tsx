import React, { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAlphas, addAlpha, deleteAlpha } from "../../store/alphaSlice";
import { toast } from "react-toastify";

export default function AlphaPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { list, loading, adding } = useAppSelector((s) => s.alpha);

  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Filters
  const [filterId, setFilterId] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlpha, setEditingAlpha] = useState<{ alphaId: number; vehicleNumber: string } | null>(null);
  const [vehicle, setVehicle] = useState("");

  useEffect(() => {
    dispatch(fetchAlphas());
  }, [dispatch, refresh]);

  // Filtering
  const filteredList = list.filter((row) => {
    const matchesId = filterId ? row.alphaId.toString().includes(filterId) : true;
    const matchesVehicle = filterVehicle
      ? row.vehicleNumber.toLowerCase().includes(filterVehicle.toLowerCase())
      : true;
    return matchesId && matchesVehicle;
  });

  // Toggle selection
  const toggleRow = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredList.map((l) => l.alphaId));
    }
    setSelectAll((s) => !s);
  };

  // Delete
  const handleDeleteSelected = async () => {
    for (const id of selected) {
      // eslint-disable-next-line no-await-in-loop
      await dispatch(deleteAlpha(id));
    }
    setSelected([]);
    setSelectAll(false);
  };

  // Add / Edit Save
  const handleSave = async () => {
    const value = vehicle.trim();
    if (!value) {
      toast.error("Vehicle number required");
      return;
    }

    if (editingAlpha) {
      // Update (if API supports PUT, create updateAlpha thunk in alphaSlice)
      toast.info("Update API not implemented yet");
    } else {
      const result = await dispatch(addAlpha(value));
      setRefresh(!refresh);
      if (addAlpha.fulfilled.match(result)) {
      }
    }
    setVehicle("");
    setEditingAlpha(null);
    setIsModalOpen(false);
  };

  const startEdit = (alpha: { alphaId: number; vehicleNumber: string }) => {
    setEditingAlpha(alpha);
    setVehicle(alpha.vehicleNumber);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Alpha (Vehicles)
      </h2>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        {/* Delete button */}
        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className={`px-4 py-2 rounded-lg text-white font-semibold ${selected.length > 0 ? "bg-red-600 hover:bg-red-700 shadow" : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Delete Selected
        </button>

        {/* Add + Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEditingAlpha(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 shadow"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add Alpha
          </button>
          {/* <input
            type="text"
            placeholder="Filter Alpha ID"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          /> */}
          <input
            type="text"
            placeholder="Filter Vehicle"
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
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
                  checked={selectAll && filteredList.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              {/* <th className="p-3">Alpha ID</th> */}
              <th className="p-3">Vehicle Number</th>
              {/* <th className="p-3 text-center">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredList.map((alpha, i) => (
              <tr
                key={alpha.alphaId}
                className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50`}
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(alpha.alphaId)}
                    onChange={() => toggleRow(alpha.alphaId)}
                  />
                </td>
                {/* <td className="p-3">{alpha.alphaId}</td> */}
                <td className="p-3">{alpha.vehicleNumber}</td>
                {/* <td className="p-3 text-center">
                  <button
                    onClick={() => startEdit(alpha)}
                    className="text-indigo-600 hover:text-indigo-800 mr-2"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5 inline-block" />
                  </button>
                </td> */}
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
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
            <h3 className="text-lg font-bold mb-4">{editingAlpha ? "Edit Alpha" : "Add Alpha"}</h3>
            <input
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder="Vehicle Number (e.g. TN1234)"
              className="w-full border rounded p-2 mb-4 focus:ring-2 focus:ring-indigo-400"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow"
              >
                Add Alpha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
