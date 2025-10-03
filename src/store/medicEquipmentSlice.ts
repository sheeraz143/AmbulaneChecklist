// store/medicEquipmentSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface MedicEquipment {
  medicEquipmentId: number;
  name: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
}

interface MedicEquipmentState {
  list: MedicEquipment[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicEquipmentState = {
  list: [],
  loading: false,
  error: null,
};

// ✅ Fetch all
export const fetchMedicEquipment = createAsyncThunk(
  "medicEquipment/fetchAll",
  async () => {
    const res = await api.get<MedicEquipment[]>("/api/MedicEquipment");
    return res.data;
  }
);

// ✅ Add
export const addMedicEquipment = createAsyncThunk(
  "medicEquipment/add",
  async ({ name }: { name: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<MedicEquipment>("/api/MedicEquipment", {
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
export const updateMedicEquipment = createAsyncThunk(
  "medicEquipment/update",
  async (
    { id, name }: { id: number; name: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<MedicEquipment>(`/api/MedicEquipment/${id}`, {
        medicEquipmentId: id,
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
export const deleteMedicEquipment = createAsyncThunk(
  "medicEquipment/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/MedicEquipment/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const medicEquipmentSlice = createSlice({
  name: "medicEquipment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchMedicEquipment.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedicEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMedicEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Medic Equipment";
      })
      // add
      .addCase(addMedicEquipment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // update
      .addCase(updateMedicEquipment.fulfilled, (state, action) => {
        state.list = state.list.map((item) =>
          item.medicEquipmentId === action.payload.medicEquipmentId
            ? action.payload
            : item
        );
      })
      // delete
      .addCase(deleteMedicEquipment.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (item) => item.medicEquipmentId !== action.payload
        );
      });
  },
});

export default medicEquipmentSlice.reducer;
