import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminValidateApi, changePasswordApi } from "../api/adminApi";
import { toast } from "react-toastify";

interface AdminState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: AdminState = {
    loading: false,
    error: null,
    success: false,
};

// ✅ Admin Login Thunk
export const validateAdminPassword = createAsyncThunk(
    "admin/login",
    async (
        { name, password }: { name: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await adminValidateApi(name, password);

            if (response.errorCode === 0) {
                return response;
            } else {
                return rejectWithValue(
                    response.errorDescription || "Something went wrong"
                );
            }
        } catch (err: any) {
            return rejectWithValue(err.message || "Network error");
        }
    }
);

// ✅ Change Password Thunk
export const changeAdminPassword = createAsyncThunk(
    "admin/changePassword",
    async (
        { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await changePasswordApi(oldPassword, newPassword);

            if (response.errorCode === 0) {
                return response;
            } else {
                return rejectWithValue(
                    response.errorDescription || "Failed to change password"
                );
            }
        } catch (err: any) {
            return rejectWithValue(err.message || "Network error");
        }
    }
);

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // --- LOGIN ---
        builder
            .addCase(validateAdminPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(validateAdminPassword.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                toast.success("Login successful", { autoClose: 3000 });
            })
            .addCase(validateAdminPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(` ${action.payload}`, { autoClose: 3000 });
            });

        // --- CHANGE PASSWORD ---
        builder
            .addCase(changeAdminPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(changeAdminPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                toast.success(
                    action.payload.errorDescription || "Password changed successfully",
                    { autoClose: 3000 }
                );
            })
            .addCase(changeAdminPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(`${action.payload}`, { autoClose: 3000 });
            });
    },
});

export default adminAuthSlice.reducer;
