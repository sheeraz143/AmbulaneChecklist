// src/api/medicEquipmentApi.ts
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

// ✅ GET all
export const fetchMedicEquipment = async (): Promise<MedicEquipment[]> => {
    const res = await api.get("/api/MedicEquipment");
    return res.data;
};

// ✅ POST (create)
export const addMedicEquipment = async (data: { name: string }): Promise<MedicEquipment> => {
    const res = await api.post("/api/MedicEquipment", data);
    return res.data;
};

// ✅ PUT (update)
export const updateMedicEquipment = async (
    id: number,
    data: { name: string }
): Promise<MedicEquipment> => {
    const res = await api.put(`/api/MedicEquipment/${id}`, data);
    return res.data;
};

// ✅ DELETE
export const deleteMedicEquipment = async (id: number): Promise<void> => {
    await api.delete(`/api/MedicEquipment/${id}`);
};
