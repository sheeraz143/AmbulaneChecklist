import React from "react";
import { useForm, Controller } from "react-hook-form";

type ChecklistFormData = {
  alpha: string;
  driver: string;
  mobNo: string;
  date: string;
  staffId: string;
  mileageStart: number;
  nextServiceMileage: number;
  atfOil: number;
  driverRemarks: string;
  tailLights: boolean;
  turnSignals: boolean;
  horns: boolean;
  wipers: boolean;
  reverseLights: boolean;
  rearInteriorLighting: boolean;
  rearFan: boolean;
  airCon: boolean;
  jackHandle: boolean;
  breakdownSign: boolean;
  spareTyre: boolean;
  bodyCondition: boolean;
  tyrePressure: boolean;
  tyreCondition: boolean;
  medicName: string;
  medicStaffId: string;
  mainOxygenTank: boolean;
  portableOxygenTank: boolean;
  foldableStretcher: boolean;
  vitalsSignSet: boolean;
  traumaBag: boolean;
  aed: boolean;
  patientSafetyBelt: boolean;
  stretcher: boolean;
  wheelchair: boolean;
  qStrain: boolean;
  suctionPumpSet: boolean;
  fireStopExtinguisher: boolean;
  dRingHooks: boolean;
  glovesQty: string;
  billingQty: string;
  maskQty: string;
  wetWipesQty: string;
  antibacteriaQty: string;
  handSanitizerQty: string;
  gauzeQty: string;
  oxygenMaskQty: string;
  medicRemarks: string;
};

// ✅ Compact reusable checkbox
function CheckboxItem({
  name,
  control,
  label,
}: { name: keyof ChecklistFormData; control: any; label: string }) {
  return (
    <label className="flex items-center gap-1 text-gray-700 text-xs sm:text-sm">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type="checkbox"
            checked={!!field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        )}
      />
      {label}
    </label>
  );
}

export default function ChecklistForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChecklistFormData>({
    defaultValues: {
      alpha: "A1",
      driver: "John Doe",
      mobNo: "9876543210",
      date: new Date().toISOString().slice(0, 10),
      staffId: "S123",
      mileageStart: undefined,
      nextServiceMileage: undefined,
      atfOil: undefined,
      driverRemarks: "",
      tailLights: false,
      turnSignals: false,
      horns: false,
      wipers: false,
      reverseLights: false,
      rearInteriorLighting: false,
      rearFan: false,
      airCon: false,
      jackHandle: false,
      breakdownSign: false,
      spareTyre: false,
      bodyCondition: false,
      tyrePressure: false,
      tyreCondition: false,
      medicName: "",
      medicStaffId: "",
      mainOxygenTank: false,
      portableOxygenTank: false,
      foldableStretcher: false,
      vitalsSignSet: false,
      traumaBag: false,
      aed: false,
      patientSafetyBelt: false,
      stretcher: false,
      wheelchair: false,
      qStrain: false,
      suctionPumpSet: false,
      fireStopExtinguisher: false,
      dRingHooks: false,
      glovesQty: "1",
      billingQty: "2",
      maskQty: "1",
      wetWipesQty: "1",
      antibacteriaQty: "1",
      handSanitizerQty: "1",
      gauzeQty: "1",
      oxygenMaskQty: "1",
      medicRemarks: "",
    },
  });

  const onSubmit = async (data: ChecklistFormData) => {
    console.log("Form submitted:", data);
    alert("✅ Form submitted successfully!");
  };

  return (
    <div className="from-indigo-500 via-purple-600 to-pink-500 min-h-screen p-3 sm:p-6 flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-5xl bg-white rounded-xl shadow-xl p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs sm:text-sm"
      >
        <h1 className="text-xl sm:text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-pink-500 text-transparent bg-clip-text">
          🚑 Ambulance Checklist
        </h1>

        {/* === Driver Section === */}
        <section className="bg-white rounded-md border border-gray-200 shadow p-3 sm:p-4 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">Driver Details</h2>

          {/* Basic details */}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Driver Name", field: "driver" },
              { label: "Mobile No", field: "mobNo" },
              { label: "Date", field: "date", type: "date" },
              { label: "Staff ID", field: "staffId" },
              { label: "Alpha", field: "alpha" },
            ].map(({ label, field, type }) => (
              <label key={field} className="block">
                <span className="font-medium">{label}</span>
                <input
                  type={type || "text"}
                  {...register(field as keyof ChecklistFormData)}
                  readOnly
                  className="mt-1 w-full rounded-md border-gray-300 bg-gray-100 p-2 text-xs sm:text-sm"
                />
              </label>
            ))}
          </div>

          {/* Checklist Items */}
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <div>
              <h3 className="font-semibold text-indigo-700 mb-2 text-sm">Lighting & Electrical</h3>
              <div className="grid grid-cols-2 gap-1">
                {[
                  "tailLights",
                  "turnSignals",
                  "horns",
                  "wipers",
                  "reverseLights",
                  "rearInteriorLighting",
                  "rearFan",
                  "airCon",
                ].map((field) => (
                  <CheckboxItem
                    key={field}
                    name={field as keyof ChecklistFormData}
                    control={control}
                    label={field}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-indigo-700 mb-2 text-sm">Tools & Exterior</h3>
              <div className="grid grid-cols-2 gap-1">
                {[
                  "jackHandle",
                  "breakdownSign",
                  "spareTyre",
                  "bodyCondition",
                  "tyrePressure",
                  "tyreCondition",
                ].map((field) => (
                  <CheckboxItem
                    key={field}
                    name={field as keyof ChecklistFormData}
                    control={control}
                    label={field}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mileage & Remarks */}
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div className="space-y-2">
              {[
                { field: "mileageStart", label: "Mileage Start" },
                { field: "nextServiceMileage", label: "Next Service Mileage EO" },
                { field: "atfOil", label: "ATF Oil" },
              ].map(({ field, label }) => (
                <label key={field} className="block">
                  <span className="font-medium">{label}</span>
                  <input
                    type="number"
                    {...register(field as keyof ChecklistFormData, {
                      required: `${label} is required`,
                      valueAsNumber: true,
                    })}
                    className="mt-1 w-full rounded-md border-gray-300 p-2 text-xs sm:text-sm"
                  />
                  {errors[field as keyof ChecklistFormData] && (
                    <p className="text-red-600 text-xs mt-1">
                      {(errors[field as keyof ChecklistFormData] as any)?.message}
                    </p>
                  )}
                </label>
              ))}
            </div>

            <label className="block">
              <span className="font-medium">Remarks</span>
              <textarea
                {...register("driverRemarks")}
                className="mt-1 w-full rounded-md border-gray-300 p-2 h-24 text-xs sm:text-sm"
              />
            </label>
          </div>
        </section>

        {/* === Medic Section === */}
        <section className="bg-white rounded-md border border-gray-200 shadow p-3 sm:p-4 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">Medic Section</h2>

          {/* Medic Info */}
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="font-medium">Medic Name</span>
              <input
                {...register("medicName")}
                className="mt-1 w-full rounded-md border-gray-300 p-2 text-xs sm:text-sm"
              />
            </label>
            <label className="block">
              <span className="font-medium">Medic Staff ID</span>
              <input
                {...register("medicStaffId")}
                className="mt-1 w-full rounded-md border-gray-300 p-2 text-xs sm:text-sm"
              />
            </label>
          </div>

          {/* Checklist + Items Table */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-1">
              {[
                "mainOxygenTank",
                "portableOxygenTank",
                "foldableStretcher",
                "vitalsSignSet",
                "traumaBag",
                "aed",
                "patientSafetyBelt",
                "stretcher",
                "wheelchair",
                "qStrain",
                "suctionPumpSet",
                "fireStopExtinguisher",
                "dRingHooks",
              ].map((field) => (
                <CheckboxItem
                  key={field}
                  name={field as keyof ChecklistFormData}
                  control={control}
                  label={field}
                />
              ))}
            </div>

            <div>
              <table className="w-full border border-gray-200 rounded text-xs sm:text-sm">
                <thead>
                  <tr className="bg-indigo-100">
                    <th className="border border-gray-200 px-2 py-1 text-left">Item</th>
                    <th className="border border-gray-200 px-2 py-1 text-center">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Gloves", field: "glovesQty" },
                    { label: "Billing", field: "billingQty" },
                    { label: "Mask", field: "maskQty" },
                    { label: "Wet Wipes", field: "wetWipesQty" },
                    { label: "Anti-bacteria Spray", field: "antibacteriaQty" },
                    { label: "Hand Sanitizer", field: "handSanitizerQty" },
                    { label: "Gauze", field: "gauzeQty" },
                    { label: "Oxygen Mask", field: "oxygenMaskQty" },
                  ].map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="border border-gray-200 px-2 py-1">{item.label}</td>
                      <td className="border border-gray-200 px-2 py-1 text-center">
                        <input
                          {...register(item.field as keyof ChecklistFormData)}
                          className="w-full rounded border-gray-300 p-1 text-center text-xs sm:text-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <label className="block mt-3">
                <span className="font-medium">Remarks</span>
                <textarea
                  {...register("medicRemarks")}
                  className="mt-1 w-full rounded-md border-gray-300 p-2 h-20 text-xs sm:text-sm"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 sm:px-8 sm:py-3 rounded-full font-bold text-white shadow bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-transform text-sm sm:text-base"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
