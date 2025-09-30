// Tools.tsx
import CrudTable from "../admin/CrudTable";
export default function Tools() {
  return <CrudTable title="Tools & Exterior" fields={[{ key: "name", label: "Tool Name" }]} />;
}

