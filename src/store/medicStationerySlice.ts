// store/medicStationerySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface MedicStationery {
  medicStationeryId: number;
  name: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
}

interface MedicStationeryState {
  list: MedicStationery[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicStationeryState = {
  list: [],
  loading: false,
  error: null,
};

// ✅ Fetch all
export const fetchMedicStationery = createAsyncThunk(
  "medicStationery/fetchAll",
  async () => {
    const res = await api.get<MedicStationery[]>("/api/MedicStationery");
    return res.data;
  }
);

// ✅ Add
export const addMedicStationery = createAsyncThunk(
  "medicStationery/add",
  async ({ name }: { name: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<MedicStationery>("/api/MedicStationery", {
        name,
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

// ✅ Update
export const updateMedicStationery = createAsyncThunk(
  "medicStationery/update",
  async (
    { id, name }: { id: number; name: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<MedicStationery>(`/api/MedicStationery/${id}`, {
        medicStationeryId: id,
        name,
        isActive: true,
        updatedDate: new Date().toISOString(),
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Delete
export const deleteMedicStationery = createAsyncThunk(
  "medicStationery/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/MedicStationery/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const medicStationerySlice = createSlice({
  name: "medicStationery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchMedicStationery.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedicStationery.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMedicStationery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Medic Stationery";
      })
      // add
      .addCase(addMedicStationery.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // update
      .addCase(updateMedicStationery.fulfilled, (state, action) => {
        state.list = state.list.map((item) =>
          item.medicStationeryId === action.payload.medicStationeryId
            ? action.payload
            : item
        );
      })
      // delete
      .addCase(deleteMedicStationery.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (item) => item.medicStationeryId !== action.payload
        );
      });
  },
});

export default medicStationerySlice.reducer;
