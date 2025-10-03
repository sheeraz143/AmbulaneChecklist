import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export type Alpha = {
    alphaId: number;
    vehicleNumber: string;
};

// ✅ GET all Alphas
export const fetchAlphasApi = async (): Promise<Alpha[]> => {
    const res = await api.get("/api/Alphas");
    return res.data;
};

// ✅ Add new Alpha
export const addAlphaApi = async (vehicleNumber: string): Promise<Alpha> => {
    const res = await api.post("/api/Alphas", { vehicleNumber });
    return res.data;
};

// ✅ Delete Alpha
export const deleteAlphaApi = async (id: number): Promise<void> => {
    await api.delete(`/api/Alphas/${id}`);
};

// ✅ Update Alpha
export const updateAlphaApi = async (id: number, vehicleNumber: string): Promise<Alpha> => {
    const res = await api.put(`/api/Alphas/${id}`, { vehicleNumber });
    return res.data;
};