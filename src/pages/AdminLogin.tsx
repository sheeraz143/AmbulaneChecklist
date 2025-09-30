import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function AdminLogin(): JSX.Element {
  const [username] = useState<string>("Admin"); // username fixed as Admin
  const [password, setPassword] = useState<string>("");
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "Admin" && password === "1234") {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/transactions");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          Admin Login
        </h2>

        {/* Username */}
        <label className="block mb-2 text-gray-700 font-semibold">Username</label>
        <input
          type="text"
          value={username}
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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-transform hover:scale-105 shadow-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
}
