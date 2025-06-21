"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "@/services/authService"
import type { User, LoginCredentials, RegisterCredentials } from "@/types/auth"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        localStorage.removeItem("auth_token")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      const response = await authService.login(credentials)
      localStorage.setItem("auth_token", response.token)
      setUser(response.user)
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      })
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true)
      const response = await authService.register(credentials)
      localStorage.setItem("auth_token", response.token)
      setUser(response.user)
      toast({
        title: "Account created!",
        description: "Welcome to your new workspace.",
      })
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
