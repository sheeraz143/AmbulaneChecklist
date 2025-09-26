// Items.tsx
import CrudTable from "../admin/CrudTable";
export default function Items() {
  return <CrudTable title="Items" fields={[{ key: "name", label: "Item Name" }]} />;
}