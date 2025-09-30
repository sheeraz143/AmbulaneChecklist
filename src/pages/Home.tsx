import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStaffId } from "../store/formSlice";

export default function Home(): JSX.Element {
  const [staffId, setId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!staffId.trim()) {
      alert("Enter Staff ID");
      return;
    }
    dispatch(setStaffId(staffId.trim()));
    localStorage.setItem("userAuth", "true");
    navigate("/user/form");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      {/* Admin Login button fixed at the very top-right corner */}
      <button
        onClick={() => navigate("/admin-login")}
        className="absolute top-6 right-6 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg shadow-lg text-sm font-semibold transition-colors"
      >
        Admin Login
      </button>

      {/* Centered Card */}
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          Enter Staff ID
        </h1>

        <input
          type="text"
          placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setId(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full mb-6 outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-transform hover:scale-105 shadow-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
