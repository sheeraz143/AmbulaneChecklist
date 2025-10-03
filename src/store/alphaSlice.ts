// src/store/alphaSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAlphasApi, addAlphaApi, deleteAlphaApi, Alpha } from "../api/alphaApi";
import { toast } from "react-toastify";

interface AlphaState {
    list: Alpha[];
    loading: boolean;
    adding: boolean;
    deleting: boolean;
    error: string | null;
}

const initialState: AlphaState = {
    list: [],
    loading: false,
    adding: false,
    deleting: false,
    error: null,
};

export const fetchAlphas = createAsyncThunk<Alpha[]>("alpha/fetch", async (_, { rejectWithValue }) => {
    try {
        return await fetchAlphasApi();
    } catch (err: any) {
        return rejectWithValue(err?.message || "Failed to fetch alphas");
    }
});

export const addAlpha = createAsyncThunk<Alpha, string>(
    "alpha/add",
    async (vehicleNumber, { rejectWithValue }) => {
        try {
            const res = await addAlphaApi(vehicleNumber);
            // Try to normalize: if backend returned an array or wrapper, handle it:
            if (Array.isArray(res)) return res[0];
            if ((res as any).data && Array.isArray((res as any).data)) return (res as any).data[0];
            return res as Alpha;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to add alpha");
        }
    }
);

export const deleteAlpha = createAsyncThunk<number, number>(
    "alpha/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteAlphaApi(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to delete alpha");
        }
    }
);

const alphaSlice = createSlice({
    name: "alpha",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // FETCH
        builder.addCase(fetchAlphas.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAlphas.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload;
        });
        builder.addCase(fetchAlphas.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            toast.error(action.payload as string);
        });

        // ADD
        builder.addCase(addAlpha.pending, (state) => {
            state.adding = true;
            state.error = null;
        });
        builder.addCase(addAlpha.fulfilled, (state, action) => {
            state.loading = false;
            state.list.push(action.payload); // ✅ Add new alpha directly
            toast.success("Alpha added successfully");
        });
        builder.addCase(addAlpha.rejected, (state, action) => {
            state.adding = false;
            state.error = action.payload as string;
            toast.error(action.payload as string);
        });

        // DELETE
        builder.addCase(deleteAlpha.pending, (state) => {
            state.deleting = true;
            state.error = null;
        });
        builder.addCase(deleteAlpha.fulfilled, (state, action) => {
            state.deleting = false;
            state.list = state.list.filter((a) => a.alphaId !== action.payload);
            toast.success("Alpha deleted");
        });
        builder.addCase(deleteAlpha.rejected, (state, action) => {
            state.deleting = false;
            state.error = action.payload as string;
            toast.error(action.payload as string);
        });
    },
});

export default alphaSlice.reducer;
