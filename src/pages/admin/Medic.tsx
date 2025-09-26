// Medic.tsx
import CrudTable from "../admin/CrudTable";
export default function Medic() {
  return <CrudTable title="Medic" fields={[{ key: "name", label: "Medic Item" }]} />;
}