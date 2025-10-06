import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import ambulanceImg from "../../src/assets/ambulance.jpeg";

type ChecklistFormData = Record<string, any>;

function CheckboxItem({
  name,
  control,
  label,
  readOnly,
}: {
  name: keyof ChecklistFormData;
  control: any;
  label: string;
  readOnly?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-gray-700 text-sm">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type="checkbox"
            checked={!!field.value}
            onChange={(e) => !readOnly && field.onChange(e.target.checked)}
            disabled={readOnly}
            className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${
              readOnly ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        )}
      />
      {label}
    </label>
  );
}

export default function ChecklistForm(): JSX.Element {
  const { register, handleSubmit, control, setValue } =
    useForm<ChecklistFormData>({
      defaultValues: { date: new Date().toISOString().split("T")[0] },
    });

  const [driverReadonly, setDriverReadonly] = useState(false);
  const [medicReadonly, setMedicReadonly] = useState(false);

  const base = import.meta.env.VITE_API_BASE_URL;
  const [lighting, setLighting] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [stationery, setStationery] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [transactionData, setTransactionData] = useState<any>(null);

  const role = localStorage.getItem("userRole") as "Driver" | "Medic";
  const vehicleNumber = localStorage.getItem("vehicleNumber") || "";
  const userCode = localStorage.getItem("userCode") || "";
  const date =
    localStorage.getItem("date") || new Date().toISOString().split("T")[0];

  const [clickPoints, setClickPoints] = useState<{ x: number; y: number }[]>(
    []
  );
  const imageRef = useRef<HTMLDivElement>(null);

  // 🖱️ Handle ambulance image clicks (Driver only)
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (driverReadonly || role === "Medic") return;
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setClickPoints((prev) => [...prev, { x, y }]);
  };

  // Format date to dd-mm-yyyy
  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
  };

  // ✅ Fetch Master Lists
  useEffect(() => {
    (async () => {
      try {
        const [l, t, s, e] = await Promise.all([
          axios.get(`${base}/api/LightingAndElectrical`),
          axios.get(`${base}/api/ToolsAndExterior`),
          axios.get(`${base}/api/MedicStationery`),
          axios.get(`${base}/api/MedicEquipment`),
        ]);
        setLighting(l.data);
        setTools(t.data);
        setStationery(s.data);
        setEquipment(e.data);
      } catch (err) {
        console.error("Master data fetch failed:", err);
      }
    })();
  }, [base]);

  // ✅ Fetch Transaction / Prefill Driver or Medic Details
  useEffect(() => {
    (async () => {
      try {
        setValue("vehicleNumber", vehicleNumber);
        setValue("date", formatDate(date));

        const res = await axios.get(`${base}/api/Transactions/by-vehicle`, {
          params: { vehicleNumber, date },
        });

        if (res.data?.length > 0) {
          const tx = res.data[0];
          setTransactionData(tx);

          if (role === "Driver") {
            setDriverReadonly(true);
            setMedicReadonly(true);
          } else if (role === "Medic") {
            setDriverReadonly(true);
            setMedicReadonly(false);
          }

          // Prefill driver section
          setValue("driverName", tx.driverName);
          setValue("driverCode", tx.driverCode);
          setValue("driverRole", tx.driverRole);
          setValue("licenseNumber", tx.licenseNumber);
          setValue("driverContact", tx.driverContact);
          setValue("driverRemarks", tx.driverRemarks);

          // Prefill medic section (readonly fields)
          setValue("medicName", tx.medicName);
          setValue("medicCode", tx.medicCode);
          setValue("medicContact", tx.medicContact);
          setValue("medicRemarks", tx.medicRemarks);

          setValue("mileageStart", tx.mileageStart || "");
          setValue("nextServiceMileageEo", tx.nextServiceMileageEo || "");
          setValue("atfoil", tx.atfoil || "");

          if (tx.coordinates?.length > 0) {
            setClickPoints(
              tx.coordinates.map((c: any) => ({
                x: c.xaxis,
                y: c.yaxis,
              }))
            );
          }

          tx.childTransactions?.forEach((c: any) => {
            if (c.inputType === "Checkbox")
              setValue(c.checkListItem, !!c.checkStatus);
            if (c.inputType === "Value")
              setValue(`${c.checkListItem}_qty`, c.quantity || "");
          });
          return;
        }

        // If no transaction found
        if (role === "Driver") {
          setDriverReadonly(false);
          setMedicReadonly(true);
          const driverRes = await axios.get(`${base}/api/Driver`);
          const user = driverRes.data.find(
            (d: any) => d.driverCode === userCode
          );
          if (user) {
            setValue("driverName", user.name);
            setValue("driverCode", user.driverCode);
            setValue("driverRole", user.role);
            setValue("licenseNumber", user.licenseNumber);
            setValue("driverContact", user.contactNumber);
          }
        } else if (role === "Medic") {
          setDriverReadonly(true);
          setMedicReadonly(false);

          // ✅ Always fetch medic info and show (readonly)
          const medicRes = await axios.get(`${base}/api/Medics`);
          const user = medicRes.data.find((m: any) => m.medicCode === userCode);
          if (user) {
            setValue("medicName", user.name);
            setValue("medicCode", user.medicCode);
            setValue("medicContact", user.contactNumber);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    })();
  }, [role, userCode, base, vehicleNumber, date, setValue]);
  // ✅ Submit Form
  const onSubmit = async (data: ChecklistFormData) => {
    try {
      const childTransactions = [
        ...lighting.map((i) => ({
          categoryType: "LightingAndElectricals",
          inputType: "Checkbox",
          checkListItem: i.name?.trim() || "",
          quantity: 0,
          checkStatus: Boolean(data[i.name]),
        })),
        ...tools.map((i) => ({
          categoryType: "ToolsAndExteriors",
          inputType: "Checkbox",
          checkListItem: i.name?.trim() || "",
          quantity: 0,
          checkStatus: Boolean(data[i.name]),
        })),
        ...stationery.map((i) => ({
          categoryType: "MedicStationeries",
          inputType: "Value",
          checkListItem: i.name?.trim() || "",
          quantity: Math.max(0, Number(data[`${i.name}_qty`] || 0)),
          checkStatus: null,
        })),
        ...equipment.map((i) => ({
          categoryType: "MedicEquipments",
          inputType: "Checkbox",
          checkListItem: i.name?.trim() || "",
          quantity: 0,
          checkStatus: Boolean(data[i.name]),
        })),
      ];

      const [day, month, year] = (data.date || "").split("-");
      const formattedDate = `${year}-${month}-${day}`;

      const payload = {
        vehicleNumber,
        driverName: data.driverName || "",
        driverCode: data.driverCode || "",
        driverRole: data.driverRole || "",
        licenseNumber: data.licenseNumber || "",
        driverContact: data.driverContact || "",
        mileageStart: Number(data.mileageStart) || "",
        nextServiceMileageEo: Number(data.nextServiceMileageEo) || "",
        atfoil: Number(data.atfoil) || "",
        medicName: data.medicName || "",
        medicCode: data.medicCode || "",
        medicContact: data.medicContact || "",
        transactionDate: formattedDate,
        createdDate: formattedDate,
        updatedDate: formattedDate,
        childTransactions,
        driverRemarks: data.driverRemarks || "",
        medicRemarks: data.medicRemarks || "",
        coordinates: clickPoints.map((p) => ({
          masterId: transactionData?.masterId || 0,
          xaxis: p.x,
          yaxis: p.y,
        })),
      };

      let res;
      if (transactionData?.masterId) {
        res = await axios.put(
          `${base}/api/Transactions/${transactionData.masterId}`,
          payload
        );
      } else {
        res = await axios.post(`${base}/api/Transactions`, payload);
      }

      toast.success(
        res.data?.message ||
          res.data?.errorDescription ||
          "Transaction saved successfully!"
      );
    } catch (err: any) {
      const msg =
        err.response?.data?.errorDescription ||
        err.response?.data?.message ||
        err.message ||
        "Submission failed!";
      toast.error(msg);
      console.error("Submit error:", msg);
    }
  };

  // ==============================
  // ✅ UI SECTION
  // ==============================
  return (
    <div className="from-indigo-500 via-purple-600 to-pink-500 min-h-screen p-6 flex justify-center">
      <ToastContainer position="top-right" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-5xl bg-white rounded-xl shadow-xl p-6 space-y-6 text-sm"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text">
          🚑 Ambulance Checklist
        </h1>

        {/* === DRIVER SECTION === */}
        <section className="border border-gray-200 shadow p-4 rounded-md space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Driver Details
          </h2>

          {/* Top Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "vehicleNumber",
              "date",
              "driverName",
              "driverCode",
              "driverRole",
            ].map((f) => (
              <div key={f}>
                <label className="font-medium capitalize">{f}</label>
                <input
                  {...register(f)}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
            ))}
          </div>

          {/* Lighting + Tools + Image */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">
                Lighting & Electrical
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {lighting.map((i) => (
                  <CheckboxItem
                    key={i.id}
                    name={i.name}
                    label={i.name}
                    control={control}
                    readOnly={driverReadonly}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">
                Tools & Exterior
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {tools.map((i) => (
                  <CheckboxItem
                    key={i.id}
                    name={i.name}
                    label={i.name}
                    control={control}
                    readOnly={driverReadonly}
                  />
                ))}
              </div>
            </div>

            {/* Image Section */}
            <div className="flex flex-col items-center">
              <div className="relative" ref={imageRef}>
                <img
                  src={ambulanceImg}
                  alt="Ambulance"
                  onClick={handleImageClick}
                  className={`w-[280px] h-auto border rounded shadow-sm ${
                    driverReadonly
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-crosshair"
                  }`}
                />
                {clickPoints.map((p, i) => (
                  <div
                    key={i}
                    className="absolute font-extrabold text-cyan-400"
                    style={{
                      top: `${p.y}px`,
                      left: `${p.x}px`,
                      fontSize: "28px",
                      textShadow: "0 0 6px #06b6d4, 0 0 10px #0891b2",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    ✕
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setClickPoints([])}
                disabled={driverReadonly}
                className={`mt-3 px-4 py-2 text-sm font-medium rounded-lg shadow-md transition ${
                  driverReadonly
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                }`}
              >
                Clear Marks
              </button>
            </div>
          </div>

          {/* Mileage */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              {["mileageStart", "nextServiceMileageEo", "atfoil"].map((f) => (
                <label key={f}>
                  <span className="font-medium capitalize">{f}</span>
                  <input
                    {...register(f)}
                    type="number"
                    readOnly={driverReadonly}
                    className="w-full p-2 border rounded"
                  />
                </label>
              ))}
            </div>

            <div>
              <label>
                <span className="font-medium">Remarks</span>
                <textarea
                  {...register("driverRemarks")}
                  readOnly={driverReadonly}
                  className="w-full border rounded p-2 h-[150px] mt-1"
                />
              </label>
            </div>
          </div>
        </section>

        {/* === MEDIC SECTION === */}
        <section className="border border-gray-200 shadow p-4 rounded-md space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Medic Section</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {["medicName", "medicCode", "medicContact"].map((f) => (
              <div key={f}>
                <label className="font-medium capitalize">{f}</label>
                <input
                  {...register(f)}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
            ))}
          </div>

          <label>
            <span className="font-medium">Remarks</span>
            <textarea
              {...register("medicRemarks")}
              readOnly={medicReadonly}
              className="w-full border rounded p-2 h-20 mt-2"
            />
          </label>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">
                Medic Equipment
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {equipment.map((i) => (
                  <CheckboxItem
                    key={i.id}
                    name={i.name}
                    label={i.name}
                    control={control}
                    readOnly={medicReadonly}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-indigo-700 mb-2">
                Medic Stationery
              </h3>
              <table className="w-full border border-gray-200 rounded text-xs sm:text-sm">
                <thead>
                  <tr className="bg-indigo-100">
                    <th className="border border-gray-200 px-2 py-1 text-left">
                      Item
                    </th>
                    <th className="border border-gray-200 px-2 py-1 text-center">
                      Qty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stationery.map((i, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="border border-gray-200 px-2 py-1">
                        {i.name}
                      </td>
                      <td className="border border-gray-200 px-2 py-1 text-center">
                        <input
                          {...register(`${i.name}_qty`)}
                          type="number"
                          min="0"
                          readOnly={medicReadonly}
                          className="w-full rounded border-gray-300 p-1 text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Submit */}
        {(!driverReadonly && role === "Driver") ||
        (!medicReadonly && role === "Medic") ? (
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-transform"
            >
              Submit
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
