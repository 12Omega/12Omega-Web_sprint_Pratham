/**
 * Authentication Redux Slice
 * Manages user authentication state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      // Handle both response formats (TypeScript server returns nested data)
      const responseData = response.data.data || response.data;
      localStorage.setItem('token', responseData.token);
      return {
        user: responseData.user,
        token: responseData.token
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string; phone?: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      // Handle both response formats (TypeScript server returns nested data)
      const responseData = response.data.data || response.data;
      localStorage.setItem('token', responseData.token);
      return {
        user: responseData.user,
        token: responseData.token
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      // Handle both response formats (TypeScript server returns nested data)
      const responseData = response.data.data || response.data;
      return {
        user: responseData.user
      };
    } catch (error: any) {
      localStorage.removeItem('token');
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to load user';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: { name: string; phone?: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(userData);
      // Handle both response formats (TypeScript server returns nested data)
      const responseData = response.data.data || response.data;
      return {
        user: responseData.user
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Profile update failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Load User
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;