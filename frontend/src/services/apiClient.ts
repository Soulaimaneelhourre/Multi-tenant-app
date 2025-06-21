import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token and tenant info
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add tenant info from subdomain
    const hostname = window.location.hostname
    const parts = hostname.split(".")
    if (parts.length > 2 || (parts.length === 2 && parts[1] === "localhost")) {
      config.headers["X-Tenant"] = parts[0]
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)
