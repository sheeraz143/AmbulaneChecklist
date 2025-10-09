import { useEffect, useState, useRef, useMemo } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchTransactions,
  deleteTransaction,
  Transaction,
} from "../../store/transactionSlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ambulanceImg from "../../assets/ambulance.jpeg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

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

  // Add these helper states near top of component
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  // Sync formatted values to your filter logic
  useEffect(() => {
    setFilterFromDate(fromDate ? format(fromDate, "yyyy-MM-dd") : "");
    setFilterToDate(toDate ? format(toDate, "yyyy-MM-dd") : "");
  }, [fromDate, toDate]);

  // const filteredData = list.filter((row: Transaction) => {
  //   // Convert transaction date to local midnight
  //   const tDate = new Date(row.transactionDate);
  //   tDate.setHours(0, 0, 0, 0);

  //   // From / To normalized
  //   const from = filterFromDate ? new Date(filterFromDate) : null;
  //   const to = filterToDate ? new Date(filterToDate) : null;
  //   if (from) from.setHours(0, 0, 0, 0);
  //   if (to) to.setHours(0, 0, 0, 0);

  //   const matchesDate = (!from || tDate >= from) && (!to || tDate <= to);

  //   const matchesSearch = globalSearch
  //     ? [
  //         row.driverName,
  //         row.driverCode,
  //         row.medicName,
  //         row.medicCode,
  //         row.vehicleNumber,
  //       ]
  //         .filter(Boolean)
  //         .some((v) => v.toLowerCase().includes(globalSearch.toLowerCase()))
  //     : true;

  //   return matchesDate && matchesSearch;
  // });

  const getFilteredData = () => {
    return list.filter((row: Transaction) => {
      const tDate = new Date(row.transactionDate);
      tDate.setHours(0, 0, 0, 0);

      const from = filterFromDate ? new Date(filterFromDate) : null;
      const to = filterToDate ? new Date(filterToDate) : null;
      if (from) from.setHours(0, 0, 0, 0);
      if (to) to.setHours(23, 59, 59, 999);

      const matchesDate = (!from || tDate >= from) && (!to || tDate <= to);

      const matchesSearch = globalSearch
        ? [
            row.driverName,
            row.driverCode,
            row.medicName,
            row.medicCode,
            row.vehicleNumber,
          ]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(globalSearch.toLowerCase()))
        : true;

      return matchesDate && matchesSearch;
    });
  };

  const filteredData = useMemo(
    () => getFilteredData(),
    [list, filterFromDate, filterToDate, globalSearch]
  );


  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

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

  // === Renders coordinate marks on ambulance ===
  const renderMarks = (points: { xaxis: number; yaxis: number }[]) =>
    points?.map((p, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: `${p.yaxis}px`,
          left: `${p.xaxis}px`,
          transform: "translate(-50%, -50%)",
          color: "#06b6d4",
          fontSize: "22px",
          fontWeight: "bold",
          textShadow: "0 0 3px #000",
        }}
      >
        ✕
      </div>
    ));

  // === Generate PDF for view ===
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

      let y = 0;
      if (imgHeight < pageHeight) y = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);

      // ✅ Instead of download, open in new tab
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

      {/* === Filters === */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className={`flex items-center px-4 py-2 rounded-lg font-semibold text-white shadow ${
            selected.length > 0
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <TrashIcon className="h-5 w-5 mr-1" />
          Delete Selected
        </button>

        {/* <div className="flex flex-wrap gap-2">
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
            placeholder="Search..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="border p-2 rounded-lg text-sm w-60 focus:ring-2 focus:ring-indigo-400"
          />
        </div> */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* === From Date === */}
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="DD-MM-YYYY"
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
            isClearable
          />

          <span className="text-gray-600 font-medium">to</span>

          {/* === To Date === */}
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="DD-MM-YYYY"
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
            minDate={fromDate} // prevent selecting before fromDate
            isClearable
          />

          {/* === Search Input === */}
          <input
            type="text"
            placeholder="Search..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="border p-2 rounded-lg text-sm w-60 focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* === Table === */}
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
              <th className="p-3">Date</th>
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
                  className={`${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
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
                    {new Date(row.transactionDate)
                      .toLocaleDateString("en-GB")
                      .replaceAll("/", "-")}
                  </td>
                  <td className="p-3">{row.vehicleNumber}</td>
                  <td className="p-3">
                    {row.driverCode
                      ? `${row.driverCode} - ${row.driverName}`
                      : "-"}
                  </td>
                  <td className="p-3">
                    {row.medicCode
                      ? `${row.medicCode} - ${row.medicName}`
                      : "-"}
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
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-8 rounded-t-lg mb-6"></div>
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
            🚑 Ambulance Checklist Report
          </h1>

          {/* === DRIVER DETAILS === */}
          <section className="border border-gray-300 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-lg mb-3">Driver Details</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <p>
                <strong>Vehicle Number:</strong> {viewData.vehicleNumber}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(viewData.transactionDate).toLocaleDateString("en-GB")}
              </p>
              <p>
                <strong>Driver Name:</strong> {viewData.driverName}
              </p>
              <p>
                <strong>Driver Code:</strong> {viewData.driverCode}
              </p>
              <p>
                <strong>License Number:</strong> {viewData.licenseNumber}
              </p>
              <p>
                <strong>Driver Contact:</strong> {viewData.driverContact}
              </p>
              <p>
                <strong>Driver Role:</strong> {viewData.driverRole}
              </p>
              <p>
                <strong>Mileage Start:</strong> {viewData.mileageStart}
              </p>
              <p>
                <strong>Next Service Mileage EO:</strong>{" "}
                {viewData.nextServiceMileageEo}
              </p>
              <p>
                <strong>ATF Oil:</strong> {viewData.atfoil}
              </p>
            </div>
            <p className="mt-3">
              <strong>Remarks:</strong> {viewData.driverRemarks || "-"}
            </p>
          </section>

          {/* === Lighting, Tools & Image === */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">
                Lighting & Electrical
              </h3>
              <ul className="grid grid-cols-2 text-sm">
                {viewData.childTransactions
                  ?.filter((c) => c.categoryType === "LightingAndElectricals")
                  .map((c, i) => (
                    <li key={i}>
                      <input
                        type="checkbox"
                        checked={!!c.checkStatus}
                        readOnly
                      />{" "}
                      {c.checkListItem}
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">
                Tools & Exterior
              </h3>
              <ul className="grid grid-cols-2 text-sm">
                {viewData.childTransactions
                  ?.filter((c) => c.categoryType === "ToolsAndExteriors")
                  .map((c, i) => (
                    <li key={i}>
                      <input
                        type="checkbox"
                        checked={!!c.checkStatus}
                        readOnly
                      />{" "}
                      {c.checkListItem}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Ambulance Image */}
            <div className="relative">
              <img
                src={ambulanceImg}
                alt="Ambulance"
                className="w-[300px] h-auto border rounded shadow-md"
              />
              {renderMarks(viewData.coordinates || [])}
            </div>
          </div>

          {/* === MEDIC SECTION === */}
          <section className="border border-gray-300 rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-3">Medic Section</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <p>
                <strong>Medic Name:</strong> {viewData.medicName}
              </p>
              <p>
                <strong>Medic Code:</strong> {viewData.medicCode}
              </p>
              <p>
                <strong>Medic Contact:</strong> {viewData.medicContact}
              </p>
            </div>
            <p className="mt-3">
              <strong>Remarks:</strong> {viewData.medicRemarks || "-"}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
