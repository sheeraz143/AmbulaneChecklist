// store/driverSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ✅ Driver interface
export interface Driver {
  driverId: number;
  name: string;
  driverCode: string;
  role: string;
  contactNumber: string;
  licenseNumber: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
}

interface DriverState {
  list: Driver[];
  loading: boolean;
  error: string | null;
}

const initialState: DriverState = {
  list: [],
  loading: false,
  error: null,
};

// ✅ Fetch Drivers
export const fetchDrivers = createAsyncThunk("drivers/fetchAll", async () => {
  const res = await api.get<Driver[]>("/api/Driver");
  return res.data;
});

// ✅ Add Driver
export const addDriver = createAsyncThunk(
  "drivers/add",
  async (
    {
      name,
      driverCode,
      role,
      contactNumber,
      licenseNumber,
    }: {
      name: string;
      driverCode: string;
      role: string;
      contactNumber: string;
      licenseNumber: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<Driver>("/api/Driver", {
        name,
        driverCode,
        role,
        contactNumber,
        licenseNumber,
        isActive: true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Update Driver
export const updateDriver = createAsyncThunk(
  "drivers/update",
  async (
    {
      id,
      name,
      driverCode,
      role,
      contactNumber,
      licenseNumber,
    }: {
      id: number;
      name: string;
      driverCode: string;
      role: string;
      contactNumber: string;
      licenseNumber: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<Driver>(`/api/Driver/${id}`, {
        name,
        driverCode,
        role,
        contactNumber,
        licenseNumber,
        isActive: true,
        updatedDate: new Date().toISOString(),
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Delete Driver
export const deleteDriver = createAsyncThunk(
  "drivers/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/Driver/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Slice
const driverSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch drivers";
      })
      .addCase(addDriver.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.list = state.list.map((d) =>
          d.driverId === action.payload.driverId ? action.payload : d
        );
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d.driverId !== action.payload);
      });
  },
});

export default driverSlice.reducer;
