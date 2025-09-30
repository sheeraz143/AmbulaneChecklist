import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export type AdminLoginResponse = {
  statusCode: number;
  isSuccess: boolean;
  data: {
    adminId: number;
    name: string;
    password: string;
  };
  message: string;
  errorDetails: string | null;
};

export const adminLoginApi = async (name: string, password: string): Promise<AdminLoginResponse> => {
  const response = await api.post<AdminLoginResponse>("/api/Admins", { name, password });
  return response.data;
};
