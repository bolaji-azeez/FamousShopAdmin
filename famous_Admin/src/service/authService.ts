// src/services/authService.ts
import api from "@/api/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}



// Success response for password change might just be a message or empty
interface PasswordChangeResponse {
  message: string; // Or whatever your API returns for success
}

export type ApiUser = { _id: string; name?: string; email?: string };
export type AuthResponse = { token: string; user: ApiUser };

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/admin/login",
    credentials
  );
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");
  return response.data;
};

// Completed function for changing password
export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<PasswordChangeResponse> => {
  const response = await api.post<PasswordChangeResponse>(
    "/auth/admin/change-password",
    passwordData
  );
  return response.data;
};

// Add more API calls as needed...
