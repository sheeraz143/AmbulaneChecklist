import { useState, useMemo, useEffect } from "react";
import {
  NavLink,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import Transactions from "./admin/Transactions";
import DriverList from "./admin/DriverList";
import ChangePassword from "./admin/ChangePassword";
import Alpha from "./admin/Alpha";
import Lighting from "./admin/Lighting";
import Tools from "./admin/Tools";
import Medic from "./admin/Medic";
// import Items from "./admin/Items";
// import Staff from "./admin/Staff";
import {
  Bars3Icon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import MedicStationery from "./admin/MedicStationery";
import MedicEquipmentPage from "./admin/MedicEquipment";

export default function AdminDashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);   // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const [isMobile, setIsMobile] = useState(false);
  const [openMaster, setOpenMaster] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Watch window width for mobile behaviour
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic page title
  const pageTitle = useMemo(() => {
    if (location.pathname.includes("transactions")) return "Transactions";
    if (location.pathname.includes("drivers")) return "Driver List";
    if (location.pathname.includes("alpha")) return "Alpha";
    if (location.pathname.includes("lighting")) return "Lighting & Electrical";
    if (location.pathname.includes("tools")) return "Tools & Exterior";
    if (location.pathname.includes("medic")) return "Medic";
    if (location.pathname.includes("items")) return "Items";
    if (location.pathname.includes("change-password")) return "Change Password";
    return "Dashboard";
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 top-0 left-0 h-full md:h-auto
        transition-all duration-300 ease-in-out bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 text-white shadow-2xl
        ${isMobile ? (mobileOpen ? "w-64" : "w-0") : collapsed ? "w-20" : "w-72"}
        overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-600">
          {!collapsed && !isMobile && (
            <h2 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-200 to-cyan-200 bg-clip-text text-transparent">
              Admin Panel
            </h2>
          )}
          {/* Desktop toggle */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed((p) => !p)}
              className="p-1 rounded hover:bg-indigo-600 transition-colors"
            >
              <Bars3Icon className="h-7 w-7 text-indigo-200" />
            </button>
          )}
          {/* Mobile close */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded hover:bg-indigo-600 transition-colors"
            >
              <XMarkIcon className="h-7 w-7 text-indigo-200" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-4 space-y-1">
          <NavLink
            to="transactions"
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `mx-3 flex items-center rounded-lg px-4 py-2 text-sm md:text-base transition-colors duration-200 ${isActive
                ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md"
                : "hover:bg-indigo-600 hover:text-white text-indigo-200"
              }`
            }
          >
            📑 {!collapsed && <span className="ml-3 font-medium">Transactions</span>}
          </NavLink>

          {/* Master List */}
          <div className="mx-3">
            <button
              onClick={() => setOpenMaster((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-2 text-indigo-200 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"
            >
              <span className="flex items-center">
                📂 {!collapsed && <span className="ml-3 font-medium">Master List</span>}
              </span>
              {!collapsed && (
                <ChevronDownIcon
                  className={`h-4 w-4 transform transition-transform ${openMaster ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {openMaster && !collapsed && (
              <div className="ml-6 mt-2 flex flex-col space-y-1">
                {[
                  { path: "drivers", icon: "👨‍✈️", name: "Driver List" },
                  { path: "alpha", icon: "🔤", name: "Alpha" },
                  { path: "lighting", icon: "💡", name: "Lighting & Electrical" },
                  { path: "tools", icon: "🛠️", name: "Tools & Exterior" },
                  { path: "medic", icon: "🩺", name: "Medic" },
                  // { path: "staff", icon: "👥", name: "Staff" },
                  { path: "medic-stationery", icon: "📑", name: "Medic Stationery" },
                  { path: "medic-equipment", icon: "🧰", name: "Medic Equipment" }

                ].map(({ path, icon, name }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => isMobile && setMobileOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-md flex items-center text-sm md:text-base transition-colors ${isActive
                        ? "bg-indigo-500 text-white shadow-md"
                        : "hover:bg-indigo-600 hover:text-white text-indigo-200"
                      }`
                    }
                  >
                    {icon} <span className="ml-2">{name}</span>
                  </NavLink>
                ))}

              </div>
            )}
          </div>

          <NavLink
            to="change-password"
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `mx-3 flex items-center rounded-lg px-4 py-2 text-sm md:text-base transition-colors duration-200 ${isActive
                ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md"
                : "hover:bg-indigo-600 hover:text-white text-indigo-200"
              }`
            }
          >
            🔑 {!collapsed && <span className="ml-3 font-medium">Change Password</span>}
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={() => setMobileOpen(true)}
                className="p-1 rounded-md text-indigo-700 hover:bg-gray-200 focus:outline-none"
              >
                <Bars3Icon className="h-7 w-7" />
              </button>
            )}
            <h1 className="text-lg sm:text-2xl font-bold text-indigo-800">
              {pageTitle}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg shadow hover:scale-105 transition-transform text-sm sm:text-base"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </header>

        {/* Routes */}
        <main className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 overflow-auto">
          <Routes>
            <Route path="transactions" element={<Transactions />} />
            <Route path="drivers" element={<DriverList />} />
            <Route path="alpha" element={<Alpha />} />
            <Route path="lighting" element={<Lighting />} />
            <Route path="tools" element={<Tools />} />
            <Route path="medic" element={<Medic />} />
            {/* <Route path="staff" element={<Staff />} /> */}
            <Route path="medic-stationery" element={<MedicStationery />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route index element={<Navigate to="transactions" replace />} />
            <Route path="medic-equipment" element={<MedicEquipmentPage />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}
