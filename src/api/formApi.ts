import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const submitChecklist = async (data: any) => {
  const response = await api.post("/checklist", data);
  return response.data;
};
