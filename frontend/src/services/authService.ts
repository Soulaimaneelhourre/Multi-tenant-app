import { apiClient } from "./apiClient";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from "../types/auth";
import axios from "axios";
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  company_token: string;
}
export const authService = {
  login: async (
    credentials: LoginCredentials,
    baseURL?: string
  ): Promise<{ user: User; token: string }> => {
    const api = axios.create({
      baseURL: baseURL || "http://localhost:3000/api", // fallback to default
    });

    const response = await api.post("/login", credentials);
    return response.data;
  },

  async register(
    userData: RegisterData,
    baseURL?: string
  ): Promise<{ message: string }> {
    const axiosInstance = axios.create({
      baseURL:
        baseURL || process.env.REACT_APP_API_URL || "http://localhost:8000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const response = await axiosInstance.post("/register", userData);
    return response.data;
  },

  async createCompany(
    company_name: string,
    domain: string
  ): Promise<{ message: string }> {
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log(
      "Creating company with name:",
      company_name,
      "and domain:",
      domain
    );
    const response = await axiosInstance.post("/register-company", {
      company_name,
      domain,
    });
    console.log("Creating company with name:", response.data);
    return response.data;
  },
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get("/user");
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/logout");
  },
};
