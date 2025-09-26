// Lighting.tsx
import CrudTable from "../admin/CrudTable";
export default function Lighting() {
  return <CrudTable title="Lighting & Electrical" fields={[{ key: "name", label: "Item Name" }]} />;
}