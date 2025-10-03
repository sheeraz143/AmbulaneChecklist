import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { validateAdminPassword } from "../store/adminAuthSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function AdminLogin(): JSX.Element {
  const [name] = useState("Admin"); // fixed username
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useAppSelector((state) => state.adminAuth);

  useEffect(() => {
    if (success) {
      navigate("/admin/transactions");
    }
  }, [success, navigate]);

  const handleLogin = async () => {
    if (!password.trim()) {
      return toast.error("Password is required");
    }

    const result = await dispatch(validateAdminPassword({ name, password }));

    if (validateAdminPassword.fulfilled.match(result)) {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/transactions");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      {/* Staff Login Button - top-right corner */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow hover:from-green-600 hover:to-emerald-700 transition-transform hover:scale-105"
      >
        Staff Login
      </button>

      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          Admin Login
        </h2>

        {/* Username */}
        <label className="block mb-2 text-gray-700 font-semibold">Username</label>
        <input
          type="text"
          value={name}
          disabled
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 bg-gray-100 text-gray-600 cursor-not-allowed"
        />

        {/* Password */}
        <label className="block mb-2 text-gray-700 font-semibold">Password</label>
        <div className="relative mb-6">
          <input
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter password"
          />
          <button
            type="button"
            onClick={() => setShowPwd((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPwd ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-transform hover:scale-105 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
