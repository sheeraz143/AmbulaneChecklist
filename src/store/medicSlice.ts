// store/medicSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface Medic {
  medicId: number;
  name: string;
  medicCode: string;
  contactNumber: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
}

interface MedicState {
  list: Medic[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicState = {
  list: [],
  loading: false,
  error: null,
};

// ✅ Fetch Medics
export const fetchMedics = createAsyncThunk("medics/fetchAll", async () => {
  const res = await api.get<Medic[]>("/api/Medics");
  return res.data;
});

// ✅ Add Medic
export const addMedic = createAsyncThunk(
  "medics/add",
  async (
    {
      name,
      medicCode,
      contactNumber,
    }: { name: string; medicCode: string; contactNumber: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<Medic>("/api/Medics", {
        name,
        medicCode,
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

// ✅ Update Medic
export const updateMedic = createAsyncThunk(
  "medics/update",
  async (medic: Medic, { rejectWithValue }) => {
    try {
      const res = await api.put<Medic>(`/api/Medics/${medic.medicId}`, {
        ...medic,
        updatedDate: new Date().toISOString(),
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Delete Medic
export const deleteMedic = createAsyncThunk(
  "medics/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/Medics/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const medicSlice = createSlice({
  name: "medic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMedics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedics.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMedics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch medics";
      })
      // Add
      .addCase(addMedic.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update
      .addCase(updateMedic.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (m) => m.medicId === action.payload.medicId
        );
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      })
      // Delete
      .addCase(deleteMedic.fulfilled, (state, action) => {
        state.list = state.list.filter((m) => m.medicId !== action.payload);
      });
  },
});

export default medicSlice.reducer;
