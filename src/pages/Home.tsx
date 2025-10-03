import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStaffId } from "../store/formSlice";
import axios from "axios";

type Alpha = {
  alphaId: number;
  vehicleNumber: string;
};

type Driver = {
  driverId: number;
  driverCode: string;
  name: string;
};

type Medic = {
  medicId: number;
  medicCode: string;
  name: string;
};

export default function Home(): JSX.Element {
  const [alphas, setAlphas] = useState<Alpha[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [medics, setMedics] = useState<Medic[]>([]);

  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedAlpha, setSelectedAlpha] = useState("");
  const [date, setDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [staffType, setStaffType] = useState<"Driver" | "Medic">("Driver");
  const [selectedStaff, setSelectedStaff] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Fetch Alphas + Drivers + Medics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const alphaRes = await axios.get<Alpha[]>(
          `${import.meta.env.VITE_API_BASE_URL}/api/Alphas`
        );
        setAlphas(alphaRes.data);

        const driverRes = await axios.get<Driver[]>(
          `${import.meta.env.VITE_API_BASE_URL}/api/Driver`
        );
        setDrivers(driverRes.data);

        const medicRes = await axios.get<Medic[]>(
          `${import.meta.env.VITE_API_BASE_URL}/api/Medics`
        );
        setMedics(medicRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Submit
  const handleSubmit = async () => {
    if (!selectedAlpha || !date || !selectedStaff) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/Transactions/by-vehicle`,
        {
          params: {
            vehicleNumber: selectedAlpha,
            date: date,
          },
        }
      );

      console.log("Transaction API response:", res.data);

      // Save staffId to redux + localstorage
      dispatch(setStaffId(selectedStaff));
      localStorage.setItem("userAuth", "true");

      // Navigate to user form with all data
      navigate("/user/form", {
        state: {
          alpha: selectedAlpha,
          date,
          staffType,
          staffId: selectedStaff,
          transactions: res.data, // pass API response forward
        },
      });
    } catch (err) {
      console.error("Error calling by-vehicle API:", err);
      alert("Failed to fetch transactions");
    }
  };

  const handleReset = () => {
    setVehicleSearch("");
    setSelectedAlpha("");
    setDate(new Date().toISOString().split("T")[0]);
    setStaffType("Driver");
    setSelectedStaff("");
  };

  // ✅ Filter vehicles as user types
  const filteredVehicles = alphas.filter((a) =>
    a.vehicleNumber.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  // ✅ Staff List
  const staffList =
    staffType === "Driver"
      ? drivers.map((d) => ({
          id: d.driverId,
          code: d.driverCode,
          name: d.name,
        }))
      : medics.map((m) => ({
          id: m.medicId,
          code: m.medicCode,
          name: m.name,
        }));

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      {/* Admin Login */}
      <button
        onClick={() => navigate("/admin-login")}
        className="absolute top-6 right-6 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg shadow-lg text-sm font-semibold transition-colors"
      >
        Admin Login
      </button>

      {/* Card */}
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          Staff Form
        </h1>

        {/* Vehicle Number Autocomplete */}
        <label className="block mb-2 font-medium text-gray-700">
          Vehicle Number
        </label>
        <div className="relative mb-4" ref={dropdownRef}>
          <input
            type="text"
            value={vehicleSearch || selectedAlpha}
            onChange={(e) => {
              setVehicleSearch(e.target.value);
              setSelectedAlpha("");
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search vehicle..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
          />
          {showDropdown && filteredVehicles.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
              {filteredVehicles.map((a) => (
                <li
                  key={a.alphaId}
                  onClick={() => {
                    setSelectedAlpha(a.vehicleNumber);
                    setVehicleSearch(a.vehicleNumber);
                    setShowDropdown(false);
                  }}
                  className="p-2 hover:bg-indigo-100 cursor-pointer"
                >
                  {a.vehicleNumber}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date */}
        <label className="block mb-2 font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-400"
        />

        {/* Staff Type */}
        <label className="block mb-2 font-medium text-gray-700">
          Staff Type
        </label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Driver"
              checked={staffType === "Driver"}
              onChange={() => {
                setStaffType("Driver");
                setSelectedStaff("");
              }}
            />
            Driver
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Medic"
              checked={staffType === "Medic"}
              onChange={() => {
                setStaffType("Medic");
                setSelectedStaff("");
              }}
            />
            Medic
          </label>
        </div>

        {/* Staff Dropdown */}
        <label className="block mb-2 font-medium text-gray-700">
          {staffType} List
        </label>
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Select {staffType}</option>
          {staffList.map((s) => (
            <option key={s.id} value={s.code}>
              {s.code} - {s.name}
            </option>
          ))}
        </select>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-transform hover:scale-105 shadow-lg"
          >
            Submit
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="flex-1 py-3 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-transform hover:scale-105 shadow"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
