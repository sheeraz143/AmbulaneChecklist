import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

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

  const [isReadonly, setIsReadonly] = useState(false);

  // Format date as dd-mm-yyyy
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

  // ✅ Fetch Transaction or fallback
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
          setIsReadonly(true); // ✅ lock full form if transaction exists

          // Prefill driver details
          setValue("driverName", tx.driverName);
          setValue("driverCode", tx.driverCode);
          setValue("driverRole", tx.driverRole);
          setValue("licenseNumber", tx.licenseNumber);
          setValue("driverContact", tx.driverContact);

          // Prefill medic details
          setValue("medicName", tx.medicName);
          setValue("medicCode", tx.medicCode);
          setValue("medicContact", tx.medicContact);

          // Prefill checklist
          tx.childTransactions?.forEach((c: any) => {
            if (c.inputType === "Checkbox")
              setValue(c.checkListItem, !!c.checkStatus);
            if (c.inputType === "Value")
              setValue(`${c.checkListItem}_qty`, c.quantity || "");
          });
          return;
        }

        // Fallback: fetch Driver/Medic info
        if (role === "Driver") {
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
      // ✅ Build child transaction data
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

      // ✅ Prepare payload
      const payload: any = {
        vehicleNumber,
        driverName: data.driverName || "",
        driverCode: data.driverCode || "",
        driverRole: data.driverRole || "",
        licenseNumber: data.licenseNumber || "",
        driverContact: data.driverContact || "",
        mileageStart: data.mileageStart || "",
        nextServiceMileageEo: data.nextServiceMileageEo || "",
        atfoil: data.atfoil || "",
        medicName: data.medicName || "",
        medicCode: data.medicCode || "",
        medicContact: data.medicContact || "",
        transactionDate: new Date().toISOString(),
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        childTransactions,
        coordinates: [],
        driverRemarks: data.driverRemarks || "",
        medicRemarks: data.medicRemarks || "",
      };

      // ✅ Check if updating existing transaction or creating new
      if (transactionData?.masterId) {
        payload.masterId = transactionData.masterId;

        const res = await axios.put(
          `${base}/api/Transactions/${transactionData.masterId}`,
          payload
        );

        // ✅ Show backend response message if available
        const message =
          res.data?.message ||
          res.data?.errorDescription ||
          "Transaction updated successfully!";
        toast.success(message);
      } else {
        try {
          const res = await axios.post(`${base}/api/Transactions`, payload);

          // ✅ Handle both success and warning responses from API
          const message =
            res.data?.message ||
            res.data?.errorDescription ||
            "Transaction created successfully!";
          toast.success(message);
        } catch (err: any) {
          // ✅ Capture backend error response
          const apiMessage =
            err.response?.data?.errorDescription ||
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Submission failed!";
          toast.error(apiMessage);
          console.error("Submit error:", apiMessage);
          return;
        }
      }
    } catch (err: any) {
      // ✅ Global error handling
      const apiMessage =
        err.response?.data?.errorDescription ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong!";
      toast.error(apiMessage);
      console.error("Submit error:", apiMessage);
    }
  };

  const readableLabel = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

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
        {/* === DRIVER SECTION === */}
        <section className="border border-gray-200 shadow p-4 rounded-md space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Driver Details
          </h2>

          {/* Top driver details */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "vehicleNumber",
              "date",
              "driverName",
              "driverCode",
              "licenseNumber",
              "driverContact",
              "driverRole",
            ].map((f) => (
              <label key={f} className="block">
                <span className="font-medium">{readableLabel(f)}</span>
                <input
                  {...register(f)}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </label>
            ))}
          </div>

          {/* Mileage fields (stacked vertically) + Remarks on right */}
          <div className="grid sm:grid-cols-2 gap-4 items-start">
            {/* Left side - stacked mileage inputs */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-medium">Mileage Start</span>
                <input
                  {...register("mileageStart")}
                  type="number"
                  readOnly={isReadonly || role === "Medic"}
                  placeholder="Enter start mileage"
                  className="w-full p-2 border rounded"
                />
              </label>

              <label className="block">
                <span className="font-medium">Next Service Mileage EO</span>
                <input
                  {...register("nextServiceMileageEo")}
                  type="number"
                  readOnly={isReadonly || role === "Medic"}
                  placeholder="Enter next service mileage"
                  className="w-full p-2 border rounded"
                />
              </label>

              <label className="block">
                <span className="font-medium">ATF Oil</span>
                <input
                  {...register("atfoil")}
                  type="number"
                  readOnly={isReadonly || role === "Medic"}
                  placeholder="Enter ATF Oil"
                  className="w-full p-2 border rounded"
                />
              </label>
            </div>

            {/* Right side - Remarks */}
            <label className="block">
              <span className="font-medium">Remarks</span>
              <textarea
                {...register("driverRemarks")}
                readOnly={isReadonly || role === "Medic"}
                placeholder="Enter remarks..."
                className="w-full border rounded p-2 h-[170px] mt-1"
              />
            </label>
          </div>

          {/* Lighting and Tools sections */}
          <div className="grid md:grid-cols-2 gap-4 mt-3">
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
                    readOnly={isReadonly || role === "Medic"}
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
                    readOnly={isReadonly || role === "Medic"}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === MEDIC SECTION === */}
        <section className="border border-gray-200 shadow p-4 rounded-md space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Medic Section</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {["medicName", "medicCode", "medicContact"].map((f) => (
              <label key={f}>
                <span className="font-medium">{readableLabel(f)}</span>
                <input
                  {...register(f)}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </label>
            ))}
          </div>

          <label>
            <span className="font-medium">Remarks</span>
            <textarea
              {...register("medicRemarks")}
              readOnly={isReadonly || role === "Driver"}
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
                    readOnly={isReadonly || role === "Driver"}
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
                          inputMode="numeric"
                          min="0"
                          onInput={(e) => {
                            const t = e.target as HTMLInputElement;
                            if (Number(t.value) < 0) t.value = "0";
                          }}
                          readOnly={isReadonly || role === "Driver"}
                          className="w-full rounded border-gray-300 p-1 text-center no-spinner"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {!isReadonly && (
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-transform"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
