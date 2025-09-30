import { useState, useEffect } from "react";
import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Bars3Icon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ChecklistForm from "./ChecklistForm";
import UserHistory from "./UserHistory";

export default function UserDashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false); // for desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // for mobile slide menu
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect mobile screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Page title
  const pageTitle = location.pathname.includes("history")
    ? "View History"
    : "Checklist Form";

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 top-0 left-0 h-full md:h-auto transition-all duration-300 ease-in-out
        bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 text-white shadow-2xl
        ${isMobile ? (mobileOpen ? "w-64" : "w-0") : collapsed ? "w-20" : "w-72"}
        overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-indigo-600">
          {!collapsed && !isMobile && (
            <h2 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-200 to-cyan-200 bg-clip-text text-transparent">
              User Panel
            </h2>
          )}

          {/* Toggle for Desktop */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="p-1 rounded hover:bg-indigo-600 transition-colors"
            >
              <Bars3Icon className="h-7 w-7 text-indigo-200" />
            </button>
          )}

          {/* Close button for Mobile */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded hover:bg-indigo-600 transition-colors"
            >
              <XMarkIcon className="h-7 w-7 text-indigo-200" />
            </button>
          )}
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col mt-4 space-y-1">
          <NavLink
            to="form"
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `mx-3 flex items-center rounded-lg px-4 py-2 text-sm md:text-base transition-colors duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md"
                  : "hover:bg-indigo-600 hover:text-white text-indigo-200"
              }`
            }
          >
            📝 {!collapsed && <span className="ml-3 font-medium">Checklist Form</span>}
          </NavLink>

          <NavLink
            to="history"
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `mx-3 flex items-center rounded-lg px-4 py-2 text-sm md:text-base transition-colors duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md"
                  : "hover:bg-indigo-600 hover:text-white text-indigo-200"
              }`
            }
          >
            📜 {!collapsed && <span className="ml-3 font-medium">View History</span>}
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
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

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200">
          <Routes>
            <Route path="form" element={<ChecklistForm />} />
            <Route path="history" element={<UserHistory />} />
            <Route index element={<Navigate to="form" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
