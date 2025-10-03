// store/toolsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface Tool {
  toolsAndExteriorId: number;
  name: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
}

interface ToolsState {
  list: Tool[];
  loading: boolean;
  error: string | null;
}

const initialState: ToolsState = {
  list: [],
  loading: false,
  error: null,
};

// ✅ Fetch Tools
export const fetchTools = createAsyncThunk("tools/fetchAll", async () => {
  const res = await api.get<Tool[]>("/api/ToolsAndExterior");
  return res.data;
});

// ✅ Add Tool
export const addTool = createAsyncThunk(
  "tools/add",
  async ({ name }: { name: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<Tool>("/api/ToolsAndExterior", {
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

// ✅ Update Tool
export const updateTool = createAsyncThunk(
  "tools/update",
  async (tool: Tool, { rejectWithValue }) => {
    try {
      const res = await api.put<Tool>(
        `/api/ToolsAndExterior/${tool.toolsAndExteriorId}`,
        {
          ...tool,
          updatedDate: new Date().toISOString(),
        }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Delete Tool
export const deleteTool = createAsyncThunk(
  "tools/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/ToolsAndExterior/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const toolsSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTools.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTools.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tools";
      })
      // Add
      .addCase(addTool.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update
      .addCase(updateTool.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (t) => t.toolsAndExteriorId === action.payload.toolsAndExteriorId
        );
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      })
      // Delete
      .addCase(deleteTool.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (t) => t.toolsAndExteriorId !== action.payload
        );
      });
  },
});

export default toolsSlice.reducer;
