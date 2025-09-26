import { useState, useMemo } from "react";
import { NavLink, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import Transactions from "./admin/Transactions";
import DriverList from "./admin/DriverList";
import ChangePassword from "./admin/ChangePassword";
import {
  Bars3Icon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Alpha from "./admin/Alpha";
import Lighting from "./admin/Lighting";
import Tools from "./admin/Tools";
import Medic from "./admin/Medic";
import Items from "./admin/Items";

export default function AdminDashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const [openMaster, setOpenMaster] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Map pathname → page title
  const pageTitle = useMemo(() => {
    if (location.pathname.includes("transactions")) return "Transactions";
    if (location.pathname.includes("drivers")) return "Driver List";
    if (location.pathname.includes("change-password")) return "Change Password";
    return "Dashboard";
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin-login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ${collapsed ? "w-16" : "w-64"
          }`}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && <h2 className="text-lg font-bold">Admin Panel</h2>}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-white"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 p-2">
          <NavLink
            to="transactions"
            className={({ isActive }) =>
              `p-2 rounded flex items-center ${isActive ? "bg-gray-600" : "hover:bg-gray-700"
              }`
            }
          >
            📑 {!collapsed && <span className="ml-2">Transactions</span>}
          </NavLink>

          {/* Master List submenu */}
          <div>
            <button
              onClick={() => setOpenMaster((prev) => !prev)}
              className="p-2 w-full flex items-center justify-between hover:bg-gray-700 rounded"
            >
              <span className="flex items-center">
                📂 {!collapsed && <span className="ml-2">Master List</span>}
              </span>
              {!collapsed && (
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${openMaster ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {openMaster && !collapsed && (
              <div className="ml-6 mt-1 flex flex-col space-y-1">
                <NavLink to="drivers" className={({ isActive }) => `p-2 rounded flex items-center ${isActive ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                  👨‍✈️ <span className="ml-2">Driver List</span>
                </NavLink>
                <NavLink to="alpha" className={({ isActive }) => `p-2 rounded flex items-center ${isActive ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                  🔤 <span className="ml-2">Alpha</span>
                </NavLink>
                <NavLink to="lighting" className={({ isActive }) => `p-2 rounded flex items-center ${isActive ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                  💡 <span className="ml-2">Lighting & Electrical</span>
                </NavLink>
                <NavLink to="tools" className={({ isActive }) => `p-2 rounded flex items-center ${isActive ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                  🛠️ <span className="ml-2">Tools & Exterior</span>
                </NavLink>
                <NavLink to="medic" className={({ isActive }) => `p-2 rounded flex items-center ${isActive ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                  🩺 <span className="ml-2">Medic</span>
                </NavLink>
                <NavLink to="items" className={({ isActive }) => `p-2 rounded flex items-center ${isActive ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                  📦 <span className="ml-2">Items</span>
                </NavLink>
              </div>
            )}
          </div>


          <NavLink
            to="change-password"
            className={({ isActive }) =>
              `p-2 rounded flex items-center ${isActive ? "bg-gray-600" : "hover:bg-gray-700"
              }`
            }
          >
            🔑 {!collapsed && <span className="ml-2">Change Password</span>}
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">{pageTitle}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="transactions" element={<Transactions />} />
            <Route path="drivers" element={<DriverList />} />
            <Route path="alpha" element={<Alpha />} />
            <Route path="lighting" element={<Lighting />} />
            <Route path="tools" element={<Tools />} />
            <Route path="medic" element={<Medic />} />
            <Route path="items" element={<Items />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route index element={<Navigate to="transactions" replace />} />
          </Routes>

        </main>
      </div>
    </div>
  );
}
