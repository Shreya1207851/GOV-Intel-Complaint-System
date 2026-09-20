import { apiClient } from "./apiClient";

export interface AuthApiPayload {
  name?: string;
  email: string;
  password: string;
  role?: "citizen" | "department" | "admin";
  department?: string;
}

export interface AuthApiUser {
  id: string;
  name: string;
  email: string;
  role: "citizen" | "department" | "admin";
  department?: string | null;
  status?: "active" | "pending" | "rejected";
}

export interface AuthApiResponse {
  token?: string;
  message?: string;
  user: AuthApiUser;
}

export const authApi = {
  login(payload: AuthApiPayload) {
    return apiClient.post("/api/auth/login", payload) as Promise<AuthApiResponse>;
  },
  register(payload: AuthApiPayload) {
    return apiClient.post("/api/auth/register", payload) as Promise<AuthApiResponse>;
  },
};
