import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminLoginApi, AdminLoginResponse } from "../api/adminApi";

export interface AdminAuthState {
  loading: boolean;
  error: string | null;
  admin: AdminLoginResponse["data"] | null;
}

const initialState: AdminAuthState = {
  loading: false,
  error: null,
  admin: null,
};

// ✅ Async thunk to login admin
export const adminLogin = createAsyncThunk<
  AdminLoginResponse["data"], // return type
  { name: string; password: string }, // arguments type
  { rejectValue: string }
>("admin/login", async ({ name, password }, { rejectWithValue }) => {
  try {
    const res = await adminLoginApi(name, password);
    if (!res.isSuccess) {
      return rejectWithValue(res.message || "Login failed");
    }
    return res.data; // only the 'data' object (adminId, name, password)
  } catch (err: any) {
    return rejectWithValue(err.message || "Something went wrong");
  }
});

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    logout(state) {
      state.admin = null;
      localStorage.removeItem("adminAuth");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        localStorage.setItem("adminAuth", JSON.stringify(action.payload));
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
