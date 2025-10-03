import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export type LightingItem = {
    lightingAndElectricalId: number;
    name: string;
    createdDate: string;
    updatedDate: string;
    isActive: boolean;
};

// GET all
export const fetchLightingApi = async (): Promise<LightingItem[]> => {
    const res = await api.get("/api/LightingAndElectrical");
    return res.data;
};

// POST (add new)
export const addLightingApi = async (name: string): Promise<LightingItem> => {
    const payload = {
        lightingAndElectricalId: 0,
        name,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        isActive: true,
    };
    const res = await api.post("/api/LightingAndElectrical", payload);
    return res.data;
};

// PUT (update)
export const updateLightingApi = async (
    id: number,
    name: string
): Promise<LightingItem> => {
    const payload = {
        lightingAndElectricalId: id,
        name,
        updatedDate: new Date().toISOString(),
        createdDate: new Date().toISOString(),
        isActive: true,
    };
    const res = await api.put(`/api/LightingAndElectrical/${id}`, payload);
    return res.data;
};

// DELETE
export const deleteLightingApi = async (id: number) => {
    await api.delete(`/api/LightingAndElectrical/${id}`);
    return id;
};
