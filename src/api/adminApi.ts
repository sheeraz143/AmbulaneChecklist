import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


export type AdminApiResponse = {
  errorCode: number;
  errorDescription: string;
};

export type ChangePasswordResponse = {
  errorCode: number;
  errorDescription: string;
};


export const adminValidateApi = async (
  name: string,
  password: string
): Promise<AdminApiResponse> => {
  const response = await api.post<AdminApiResponse>(
    "/api/Admins/Validate",
    { name, password }
  );
  return response.data;
};



export const changePasswordApi = async (
  oldPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  const response = await api.post<ChangePasswordResponse>(
    "/api/Admins/changePassword",
    { oldPassword, newPassword }
  );
  return response.data;
};