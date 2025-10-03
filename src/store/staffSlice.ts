// store/staffSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface Staff {
  staffId: number;
  name: string;
  staffCode: string;
  role: string;
  contactNumber: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
}

interface StaffState {
  list: Staff[];
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  list: [],
  loading: false,
  error: null,
};

// ✅ Fetch Staffs
export const fetchStaffs = createAsyncThunk("staffs/fetchAll", async () => {
  const res = await api.get<Staff[]>("/api/Staffs");
  return res.data;
});

// ✅ Add Staff
export const addStaff = createAsyncThunk(
  "staffs/add",
  async (
    {
      name,
      staffCode,
      role,
      contactNumber,
    }: { name: string; staffCode: string; role: string; contactNumber: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<Staff>("/api/Staffs", {
        name,
        staffCode,
        role,
        contactNumber,
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

// ✅ Update Staff
export const updateStaff = createAsyncThunk(
  "staffs/update",
  async (staff: Staff, { rejectWithValue }) => {
    try {
      const res = await api.put<Staff>(`/api/Staffs/${staff.staffId}`, {
        ...staff,
        updatedDate: new Date().toISOString(),
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Delete Staff
export const deleteStaff = createAsyncThunk(
  "staffs/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/Staffs/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const staffSlice = createSlice({
  name: "staffs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStaffs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStaffs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch staffs";
      })
      .addCase(addStaff.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.list = state.list.map((s) =>
          s.staffId === action.payload.staffId ? action.payload : s
        );
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (staff) => staff.staffId !== action.payload
        );
      });
  },
});

export default staffSlice.reducer;
