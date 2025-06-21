import { apiClient } from "./apiClient"
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from "../types/auth"

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post("/login", credentials)
    return response.data
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
