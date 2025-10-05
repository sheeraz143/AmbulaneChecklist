import { useEffect, useState, useRef } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchTransactions,
  deleteTransaction,
  Transaction,
} from "../../store/transactionSlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Transactions() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.transactions);

  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [viewData, setViewData] = useState<Transaction | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const filteredData = list.filter((row: Transaction) => {
    const tDate = new Date(row.transactionDate);
    const from = filterFromDate ? new Date(filterFromDate) : null;
    const to = filterToDate ? new Date(filterToDate) : null;
    const matchesDate = (!from || tDate >= from) && (!to || tDate <= to);
    const matchesSearch = globalSearch
      ? [row.driverName, row.driverCode, row.medicName, row.medicCode, row.vehicleNumber]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(globalSearch.toLowerCase()))
      : true;
    return matchesDate && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectAll) setSelected([]);
    else setSelected(filteredData.map((r) => r.masterId));
    setSelectAll(!selectAll);
  };

  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    selected.forEach((id) => dispatch(deleteTransaction(id)));
    setSelected([]);
    setSelectAll(false);
  };

  // ✅ PDF: Single-page, full width, professional layout
  const handleGeneratePDF = async (row: Transaction) => {
    setViewData(row);

    setTimeout(async () => {
      if (!pdfRef.current) return;

      const canvas = await html2canvas(pdfRef.current, {
        scale: 3,
        useCORS: true,
        scrollY: 0,
        windowWidth: pdfRef.current.scrollWidth,
        windowHeight: pdfRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const scale = pageHeight / imgHeight;
      const finalWidth = imgWidth * scale;
      const finalHeight = imgHeight * scale;
      const yOffset = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, "PNG", 0, yOffset, finalWidth, finalHeight);

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      setViewData(null);
    }, 300);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Transactions
      </h2>

      {/* Filters + Delete */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className={`flex items-center px-4 py-2 rounded-lg font-semibold text-white shadow ${selected.length > 0
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          <TrashIcon className="h-5 w-5 mr-1" />
          Delete Selected
        </button>

        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
          <span className="self-center text-gray-600 font-medium">to</span>
          <input
            type="date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Search by vehicle, driver, medic..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="border p-2 rounded-lg text-sm w-60 focus:ring-2 focus:ring-indigo-400"
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
              <th className="p-3">Date </th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Driver</th>
              <th className="p-3">Medic</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, i) => (
                <tr
                  key={row.masterId}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50 transition-colors`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(row.masterId)}
                      onChange={() => toggleRow(row.masterId)}
                    />
                  </td>
                  <td className="p-3">
                    {new Date(row.transactionDate).toLocaleString("en-GB", {
                      dateStyle: "short",
                    })}
                  </td>
                  <td className="p-3">{row.vehicleNumber}</td>
                  <td className="p-3">
                    {row.driverCode ? `${row.driverCode} - ${row.driverName}` : "-"}
                  </td>
                  <td className="p-3">
                    {row.medicCode ? `${row.medicCode} - ${row.medicName}` : "-"}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleGeneratePDF(row)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="View PDF"
                    >
                      <EyeIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === Hidden PDF Layout === */}
      {viewData && (
        <div
          ref={pdfRef}
          className="p-10 bg-white text-gray-800 w-[1200px] absolute top-0 left-[-9999px] font-sans"
          style={{
            boxSizing: "border-box",
            lineHeight: 1.6,
          }}
        >
          {/* === Header Bar === */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-8 rounded-t-lg mb-6"></div>
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
            🚑 Ambulance Checklist Report
          </h1>

          {/* === DRIVER DETAILS === */}
          <section className="pdf-section border border-gray-300 rounded-lg p-4 mb-6">
            <h2>Driver Details</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ["Vehicle Number", viewData.vehicleNumber],
                ["Date", new Date(viewData.transactionDate).toLocaleDateString("en-GB")],
                ["Driver Name", viewData.driverName],
                ["Driver Code", viewData.driverCode],
                ["License Number", viewData.licenseNumber],
                ["Driver Contact", viewData.driverContact],
                ["Driver Role", viewData.driverRole],
              ].map(([label, value], i) => (
                <div key={i}>
                  <label>{label}</label>
                  <p className="pdf-input">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label>Remarks</label>
              <p className="pdf-input">{viewData.driverRemarks || "-"}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="font-semibold text-indigo-700 mb-2">
                  Lighting & Electrical
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {viewData.childTransactions
                    .filter((c) => c.categoryType === "LightingAndElectricals")
                    .map((c, i) => (
                      <div key={i} className="pdf-checkbox-group">
                        <input type="checkbox" checked={!!c.checkStatus} readOnly />
                        <span>{c.checkListItem}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-indigo-700 mb-2">
                  Tools & Exterior
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {viewData.childTransactions
                    .filter((c) => c.categoryType === "ToolsAndExteriors")
                    .map((c, i) => (
                      <div key={i} className="pdf-checkbox-group">
                        <input type="checkbox" checked={!!c.checkStatus} readOnly />
                        <span>{c.checkListItem}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* === MEDIC SECTION === */}
          <section className="pdf-section border border-gray-300 rounded-lg p-4">
            <h2>Medic Section</h2>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ["Medic Name", viewData.medicName],
                ["Medic Code", viewData.medicCode],
                ["Medic Contact", viewData.medicContact],
              ].map(([label, value], i) => (
                <div key={i}>
                  <label>{label}</label>
                  <p className="pdf-input">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label>Remarks</label>
              <p className="pdf-input">{viewData.medicRemarks || "-"}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="font-semibold text-indigo-700 mb-2">
                  Medic Equipment
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {viewData.childTransactions
                    .filter((c) => c.categoryType === "MedicEquipments")
                    .map((c, i) => (
                      <div key={i} className="pdf-checkbox-group">
                        <input type="checkbox" checked={!!c.checkStatus} readOnly />
                        <span>{c.checkListItem}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-indigo-700 mb-2">
                  Medic Stationery
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewData.childTransactions
                      .filter((c) => c.categoryType === "MedicStationeries")
                      .map((c, i) => (
                        <tr key={i}>
                          <td>{c.checkListItem}</td>
                          <td className="text-center">{c.quantity || 0}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* PDF Styling */}
          <style>
            {`
              .pdf-section label {
                display: block;
                font-weight: 600;
                margin-bottom: 4px;
                color: #374151;
              }
              .pdf-input {
                background-color: #f9fafb;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                padding: 8px 10px;
                margin-bottom: 10px;
                width: 100%;
                font-size: 13px;
              }
              .pdf-checkbox-group {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: #374151;
              }
              .pdf-checkbox-group input[type="checkbox"] {
                accent-color: #6366f1;
                width: 16px;
                height: 16px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #e5e7eb;
                padding: 6px;
                text-align: left;
                font-size: 12px;
              }
              th {
                background-color: #eef2ff;
                font-weight: 600;
                color: #3730a3;
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
}
