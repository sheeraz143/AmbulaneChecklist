import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ------------------ Types ------------------
export interface ChildTransaction {
    childId: number;
    masterId: number;
    categoryType: string;
    inputType: string;
    checkListItem: string;
    quantity: number;
    checkStatus: boolean;
}

export interface Transaction {
    masterId: number;
    vehicleNumber: string;
    driverName: string;
    driverCode: string;
    driverRole: string;
    licenseNumber: string;
    driverContact: string;
    medicName: string;
    medicCode: string;
    medicContact: string;
    transactionDate: string;
    createdDate: string;
    updatedDate: string;
    childTransactions: ChildTransaction[];
}

interface TransactionState {
    list: Transaction[];
    byVehicle: Transaction[];
    loading: boolean;
    error: string | null;
}

const initialState: TransactionState = {
    list: [],
    byVehicle: [],
    loading: false,
    error: null,
};

// ------------------ Thunks ------------------

// ✅ Fetch all transactions
export const fetchTransactions = createAsyncThunk(
    "transactions/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get<Transaction[]>("/api/Transactions");
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ✅ Fetch by vehicle number


export interface Transaction {
    masterId: number;
    vehicleNumber: string;
    driverName: string;
    driverCode: string;
    driverRole: string;
    licenseNumber: string;
    driverContact: string;
    medicName: string;
    medicCode: string;
    medicContact: string;
    transactionDate: string;
    createdDate: string;
    updatedDate: string;
    childTransactions: {
        childId: number;
        masterId: number;
        categoryType: string;
        inputType: string;
        checkListItem: string;
        quantity: number;
        checkStatus: boolean;
    }[];
}

// ✅ Fetch by vehicle + date
export const fetchTransactionsByVehicle = createAsyncThunk(
    "transactions/fetchByVehicle",
    async (
        { vehicleNumber, date }: { vehicleNumber: string; date: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.get<Transaction[]>(
                `/api/Transactions/by-vehicle`,
                {
                    params: { vehicleNumber, date },
                }
            );
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ✅ Add transaction
export const addTransaction = createAsyncThunk(
    "transactions/add",
    async (payload: Omit<Transaction, "masterId" | "createdDate" | "updatedDate">, { rejectWithValue }) => {
        try {
            const res = await api.post<Transaction>("/api/Transactions", {
                ...payload,
                createdDate: new Date().toISOString(),
                updatedDate: new Date().toISOString(),
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ✅ Update transaction
export const updateTransaction = createAsyncThunk(
    "transactions/update",
    async (
        { id, ...changes }: { id: number } & Partial<Transaction>,
        { rejectWithValue }
    ) => {
        try {
            const res = await api.put<Transaction>(`/api/Transactions/${id}`, {
                ...changes,
                updatedDate: new Date().toISOString(),
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ✅ Delete transaction
export const deleteTransaction = createAsyncThunk(
    "transactions/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/api/Transactions/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ------------------ Slice ------------------
const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch all
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch transactions";
            })
            // fetch by vehicle
            .addCase(fetchTransactionsByVehicle.fulfilled, (state, action) => {
                state.byVehicle = action.payload;
            })
            // add
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            // update
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.list = state.list.map((t) =>
                    t.masterId === action.payload.masterId ? action.payload : t
                );
            })
            // delete
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.list = state.list.filter((t) => t.masterId !== action.payload);
            });
    },
});

export default transactionSlice.reducer;
