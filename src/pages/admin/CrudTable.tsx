import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export type CrudField = {
  key: string;
  label: string;
};

interface CrudTableProps {
  title: string;
  fields: CrudField[];
  data: any[];
  onAdd: (row: Record<string, string>) => void;
  onDelete: (ids: number[]) => void;
}

export default function CrudTable({ title, fields, data, onAdd, onDelete }: CrudTableProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRow, setNewRow] = useState<Record<string, string>>({});

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(data.map((row) => row.lightingAndElectricalId));
    }
    setSelectAll(!selectAll);
  };

  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    onDelete(selected);
    setSelected([]);
    setSelectAll(false);
  };

  const handleAddRow = () => {
    if (fields.some((f) => !newRow[f.key])) {
      alert("Please fill all fields");
      return;
    }
    onAdd(newRow);
    setNewRow({});
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {/* Actions */}
      <div className="flex justify-between mb-4">
        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className={`px-4 py-2 rounded text-white ${
            selected.length > 0 ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Delete Selected
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-1" /> Add {title}
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden text-sm">
        <thead>
          <tr className="bg-indigo-600 text-white text-left">
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={selectAll && data.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            {fields.map((f) => (
              <th key={f.key} className="px-4 py-3">{f.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.lightingAndElectricalId}
              className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50`}
            >
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selected.includes(row.lightingAndElectricalId)}
                  onChange={() => toggleRow(row.lightingAndElectricalId)}
                />
              </td>
              {fields.map((f) => (
                <td key={f.key} className="px-4 py-2">{row[f.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Add {title}</h3>
            <div className="space-y-3">
              {fields.map((f) => (
                <input
                  key={f.key}
                  type="text"
                  placeholder={f.label}
                  value={newRow[f.key] || ""}
                  onChange={(e) => setNewRow({ ...newRow, [f.key]: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRow}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
