import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLightingApi,
  addLightingApi,
  updateLightingApi,
  deleteLightingApi,
  LightingItem,
} from "../api/lightingApi";
import { toast } from "react-toastify";

interface LightingState {
  list: LightingItem[];
  loading: boolean;
  error: string | null;
}

const initialState: LightingState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchLighting = createAsyncThunk("lighting/fetch", async () => {
  return await fetchLightingApi();
});

export const addLighting = createAsyncThunk(
  "lighting/add",
  async (name: string) => {
    return await addLightingApi(name);
  }
);

export const updateLighting = createAsyncThunk(
  "lighting/update",
  async ({ id, name }: { id: number; name: string }) => {
    return await updateLightingApi(id, name);
  }
);

export const deleteLighting = createAsyncThunk(
  "lighting/delete",
  async (id: number) => {
    return await deleteLightingApi(id);
  }
);

const lightingSlice = createSlice({
  name: "lighting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLighting.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLighting.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchLighting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching lighting";
      })
      .addCase(addLighting.fulfilled, (state, action) => {
        state.list.push(action.payload);
        toast.success("Lighting item added");
      })
      .addCase(updateLighting.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (item) =>
            item.lightingAndElectricalId ===
            action.payload.lightingAndElectricalId
        );
        if (index > -1) state.list[index] = action.payload;
        toast.success("Lighting item updated");
      })
      .addCase(deleteLighting.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (item) => item.lightingAndElectricalId !== action.payload
        );
        toast.success("Lighting item deleted");
      });
  },
});

export default lightingSlice.reducer;
