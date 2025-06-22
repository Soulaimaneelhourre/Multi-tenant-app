import { apiClient } from "./apiClient"
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from "../types/auth"
import axios from "axios";

export const authService = {
  login: async (
    credentials: LoginCredentials,
    baseURL?: string
  ): Promise<{ user: User; token: string }> => {
    const api = axios.create({
      baseURL: baseURL || 'http://localhost:3000/api', // fallback to default
    });

    const response = await api.post('/login', credentials);
    return response.data;
  },


  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post("/register", credentials)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get("/user")
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post("/logout")
  },
}
