import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStaffId } from "../store/formSlice";

export default function Home() {
  const [staffId, setId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!staffId) return alert("Enter Staff ID");
    dispatch(setStaffId(staffId));
    localStorage.setItem("userAuth", "true"); // mark user as logged in
    navigate("/user/form"); // ✅ redirect into user dashboard sidebar
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      {/* Admin Login button in top-right */}
      <button
        onClick={() => navigate("/admin-login")}
        className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition-colors"
      >
        Admin Login
      </button>

      <h1 className="text-xl font-bold mb-4">Enter Staff ID</h1>
      <input
        type="text"
        placeholder="Staff ID"
        value={staffId}
        onChange={(e) => setId(e.target.value)}
        className="border rounded-lg p-2 w-full max-w-xs"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Submit
      </button>
    </div>
  );
}
