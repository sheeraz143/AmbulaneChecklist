import React from "react";
import { useForm, Controller } from "react-hook-form";

type ChecklistFormData = {
  // Top form
  alpha: string;
  driver: string;
  mobNo: string;
  date: string;
  staffId: string;
  mileageStart: string;
  nextServiceMileage: string;
  atfOil: string;
  driverRemarks: string;

  // Driver checklist items
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

  // Medic section
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

  // Quantities
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

export default function ChecklistForm() {
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
      date: new Date().toISOString().slice(0, 10), // today
      staffId: "S123",
      mileageStart: "",
      nextServiceMileage: "",
      atfOil: "",
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

  const onSubmit = (data: ChecklistFormData) => {
    console.log("Form submitted:", data);
    alert("Form submitted! Check console for output.");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center mb-4">Ambulance Checklist</h1>

        {/* Driver Section */}
        <div className="bg-white border-2 border-black p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-bold flex flex-col">
                Name:
                <input
                  {...register("driver")}
                  className="border-b border-black outline-none px-1 py-1 w-full bg-gray-100"
                  readOnly
                />
              </label>

              <label className="font-bold flex flex-col">
                Mob No:
                <input
                  {...register("mobNo")}
                  className="border-b border-black outline-none px-1 py-1 w-full bg-gray-100"
                  readOnly
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="font-bold flex flex-col">
                DATE:
                <input
                  type="date"
                  {...register("date")}
                  className="border-b border-black outline-none px-1 py-1 w-full bg-gray-100"
                  readOnly
                />
              </label>

              <label className="font-bold flex flex-col">
                STAFF ID:
                <input
                  {...register("staffId")}
                  className="border-b border-black outline-none px-1 py-1 w-full bg-gray-100"
                  readOnly
                />
              </label>

              <label className="font-bold flex flex-col">
                ALPHA:
                <input
                  {...register("alpha")}
                  className="border-b border-black outline-none px-1 py-1 w-full bg-gray-100"
                  readOnly
                />
              </label>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {/* Lighting & Electrical */}
            <div className="space-y-2">
              <h3 className="font-bold underline">Lighting & Electrical</h3>
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
                <div key={field} className="flex items-center space-x-2 text-sm">
                  <Controller
                    name={field as keyof ChecklistFormData}
                    control={control}
                    render={({ field: ctrlField }) => (
                      <input
                        type="checkbox"
                        checked={!!ctrlField.value}
                        onChange={(e) => ctrlField.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <span>{field}</span>
                </div>
              ))}
            </div>

            {/* Tools & Exterior */}
            <div className="space-y-2">
              <h3 className="font-bold underline">Tools & Exterior</h3>
              {[
                "jackHandle",
                "breakdownSign",
                "spareTyre",
                "bodyCondition",
                "tyrePressure",
                "tyreCondition",
              ].map((field) => (
                <div key={field} className="flex items-center space-x-2 text-sm">
                  <Controller
                    name={field as keyof ChecklistFormData}
                    control={control}
                    render={({ field: ctrlField }) => (
                      <input
                        type="checkbox"
                        checked={!!ctrlField.value}
                        onChange={(e) => ctrlField.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <span>{field}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mileage & Remarks */}
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="flex flex-col font-bold">
                Mileage Start:
                <input
                  type="text"
                  {...register("mileageStart", {
                    required: "Mileage Start is required",
                    pattern: { value: /^[0-9]+$/, message: "Must be a number" },
                  })}
                  className="border-b border-black outline-none px-1 py-1 w-full"
                />
                {errors.mileageStart && (
                  <p className="text-red-600 text-sm">{errors.mileageStart.message}</p>
                )}
              </label>

              <label className="flex flex-col font-bold">
                Next Service Mileage EO:
                <input
                  type="text"
                  {...register("nextServiceMileage", {
                    required: "Next Service Mileage is required",
                    pattern: { value: /^[0-9]+$/, message: "Must be a number" },
                  })}
                  className="border-b border-black outline-none px-1 py-1 w-full"
                />
                {errors.nextServiceMileage && (
                  <p className="text-red-600 text-sm">{errors.nextServiceMileage.message}</p>
                )}
              </label>

              <label className="flex flex-col font-bold">
                ATF Oil:
                <input
                  type="text"
                  {...register("atfOil", {
                    required: "ATF Oil value is required",
                    pattern: { value: /^[0-9]+$/, message: "Must be a number" },
                  })}
                  className="border-b border-black outline-none px-1 py-1 w-full"
                />
                {errors.atfOil && (
                  <p className="text-red-600 text-sm">{errors.atfOil.message}</p>
                )}
              </label>
            </div>

            <div className="space-y-2">
              <label className="font-bold flex flex-col">
                Remarks:
                <textarea
                  {...register("driverRemarks")}
                  className="border border-black outline-none px-2 py-1 w-full resize-none h-32"
                  placeholder="Enter any remarks..."
                />
              </label>
            </div>
          </div>
        </div>

        {/* Medic Section */}
        <div className="bg-white border-2 border-black p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Left: Medic Info */}
            <label className="flex flex-col font-bold">
              MEDIC:
              <input
                {...register("medicName")}
                className="border-b border-black outline-none px-1 py-1 w-full"
              />
            </label>
            <label className="flex flex-col font-bold">
              STAFF ID:
              <input
                {...register("medicStaffId")}
                className="border-b border-black outline-none px-1 py-1 w-full"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Medic Checklist */}
            <div className="grid sm:grid-cols-2 md:grid-cols-1 gap-4 mt-4">
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
                <div key={field} className="flex items-center space-x-2 text-sm">
                  <Controller
                    name={field as keyof ChecklistFormData}
                    control={control}
                    render={({ field: ctrlField }) => (
                      <input
                        type="checkbox"
                        checked={!!ctrlField.value}
                        onChange={(e) => ctrlField.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <span>{field}</span>
                </div>
              ))}

              {/* Remarks */}
              <div className="mt-4">
                <label className="font-bold flex flex-col">
                  Remarks:
                  <textarea
                    {...register("medicRemarks")}
                    className="border border-black outline-none px-2 py-1 w-full resize-none h-24"
                    placeholder="Enter any remarks..."
                  />
                </label>
              </div>
            </div>

            {/* Table Section */}
            <div className="mt-4 overflow-x-auto">
              <table className="border border-black w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-black px-2 py-1 text-left">Items</th>
                    <th className="border border-black px-2 py-1 text-center">Quantity in Rear</th>
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
                    <tr key={idx}>
                      <td className="border border-black px-2 py-1">{item.label}</td>
                      <td className="border border-black px-2 py-1 text-center">
                        <input
                          type="text"
                          {...register(item.field as keyof ChecklistFormData)}
                          className="w-full text-center outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
