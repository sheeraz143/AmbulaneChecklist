
import CrudTable from "./CrudTable";

export default function Lighting() {
  return (
    <CrudTable
     title="Lighting & Electrical"
      fields={[
        { key: "date", label: "Date" },
        { key: "staffId", label: "Staff ID" },
        { key: "driver", label: "Driver" },
      ]}
    />
  );
}
