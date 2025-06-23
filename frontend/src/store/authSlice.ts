// store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";
import type { LoginCredentials, User, RegisterData } from "../types/auth";
import type { RootState } from "../store";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  success: string | null;

}

// Helper function to get initial state from localStorage
const getInitialState = (): AuthState => {
  try {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (storedToken && storedUser) {
      return {
        user: JSON.parse(storedUser),
        token: storedToken,
        loading: false,
        error: null,
        isAuthenticated: true,
        success: null,

      };
    }
  } catch (error) {
    // Clear invalid stored data
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
  
  return {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    success: null,
  };
};

const initialState: AuthState = getInitialState();

// Async thunk for login
export const login = createAsyncThunk<
  { user: User; token: string },
  { credentials: LoginCredentials; domain?: string },
  { rejectValue: string }
>("auth/login", async ({ credentials, domain }, { rejectWithValue }) => {
  try {
    const baseURL = domain ? `http://${domain}:8000/` : undefined;
    const response = await authService.login(credentials, baseURL);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// Async thunk for register
export const register = createAsyncThunk<
  { message: string },
  { userData: RegisterData; domain?: string },
  { rejectValue: string }
>("auth/register", async ({ userData, domain }, { rejectWithValue }) => {
  try {
    const baseURL = domain ? `http://${domain}:8000/` : undefined;
    const response = await authService.register(userData, baseURL);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 
      error.response?.data?.errors || 
      "Registration failed"
    );
  }
});

export const createCompany = createAsyncThunk<
  { message: string },
  { company_name: string; domain: string },
  { rejectValue: string }
>("auth/createCompany", async ({ company_name, domain }, { rejectWithValue }) => {
  try {
    const response = await authService.createCompany(company_name, domain);
    console.log("Company created successfully:", response);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 
      error.response?.data?.errors || 
      "Company registration failed"
    );
  }
});
// Async thunk for logout
export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      // Even if logout fails on server, we'll clear local state
      console.warn('Server logout failed:', error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    clearError(state) {
      state.error = null;
    },
    restoreAuthState(state, action) {
      // This can be used to restore state from localStorage
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        
        // Persist to localStorage
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('authUser', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Don't set authenticated state for registration
        // User will need to login after registration
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : "Registration failed";
      })
      // Logout cases
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      });
  },
});

export const { logout, clearError, restoreAuthState } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;