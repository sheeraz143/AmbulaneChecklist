import { useState } from "react";
import { NavLink, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import ChecklistForm from "./ChecklistForm";
import UserHistory from "./UserHistory";

export default function UserDashboard(): JSX.Element {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Dynamic page title
    const pageTitle = location.pathname.includes("history")
        ? "View History"
        : "Form";

    const handleLogout = () => {
        localStorage.removeItem("userAuth");
        navigate("/");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-gradient-to-b from-teal-600 via-cyan-700 to-blue-900 text-white transition-all duration-300 ${collapsed ? "w-16" : "w-64"
                    }`}
            >

                <div className="flex items-center justify-between p-4">
                    {!collapsed && <h2 className="text-lg font-bold">User Panel</h2>}
                    <button onClick={() => setCollapsed((prev) => !prev)} className="text-white">
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex flex-col space-y-2 p-2">
                    <NavLink
                        to="form"
                        className={({ isActive }) =>
                            `p-2 rounded flex items-center ${isActive ? "bg-blue-600" : "hover:bg-blue-700"
                            }`
                        }
                    >
                        📝 {!collapsed && <span className="ml-2">Form</span>}
                    </NavLink>

                    <NavLink
                        to="history"
                        className={({ isActive }) =>
                            `p-2 rounded flex items-center ${isActive ? "bg-blue-600" : "hover:bg-blue-700"
                            }`
                        }
                    >
                        📜 {!collapsed && <span className="ml-2">View History</span>}
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

                {/* Content */}
                <main className="flex-1 p-6">
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
