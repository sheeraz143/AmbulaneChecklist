import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin(): JSX.Element {
  const [username, setUsername] = useState<string>("Admin");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

        <label className="block mb-2 font-medium">Username</label>
        <input
          type="text"
          value={username}
          disabled
          className="border rounded w-full p-2 mb-4 bg-gray-100"
        />

        <label className="block mb-2 font-medium">Password</label>
        <div className="flex border rounded w-full p-2 mb-4 items-center">
          <input
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPwd((prev) => !prev)}
            className="text-sm text-blue-600 ml-2"
          >
            {showPwd ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
}
