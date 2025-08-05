/**
 * API Service Layer
 * Centralized HTTP client for ParkEase Web API
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'; // Use relative path to leverage Vite proxy

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      // Unauthorized - clear token but don't force redirect
      // Let the AuthContext and ProtectedRoute handle the redirect
      localStorage.removeItem('token');
      toast.error('Session expired. Please login again.');
    } else if (response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
    } else if (response?.status === 404) {
      toast.error('Resource not found.');
    } else if (response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else if (!response) {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),

  register: (userData: { name: string; email: string; password: string; phone?: string }) =>
    apiClient.post('/auth/register', userData),

  getProfile: () =>
    apiClient.get('/auth/profile'),

  updateProfile: (userData: { name: string; phone?: string }) =>
    apiClient.put('/auth/profile', userData),

  refreshToken: () =>
    apiClient.post('/auth/refresh'),

  logout: () =>
    apiClient.post('/auth/logout'),
};

// Export individual functions for direct import
export const registerUser = (userData: { name: string; email: string; password: string; phone?: string }) =>
  authAPI.register(userData);

// Spots API
export const spotsAPI = {
  getSpots: (params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    location?: string;
    minRate?: number;
    maxRate?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      // Check if value exists and is not empty
      if (value !== undefined && value !== null && String(value) !== '') {
        queryParams.append(key, String(value));
      }
    });
    return apiClient.get(`/spots?${queryParams.toString()}`);
  },

  getSpotById: (spotId: string) =>
    apiClient.get(`/spots/${spotId}`),

  createSpot: (spotData: any) =>
    apiClient.post('/spots', spotData),

  updateSpot: (spotId: string, spotData: any) =>
    apiClient.put(`/spots/${spotId}`, spotData),

  updateSpotStatus: (spotId: string, status: string) =>
    apiClient.patch(`/spots/${spotId}/status`, { status }),

  deleteSpot: (spotId: string) =>
    apiClient.delete(`/spots/${spotId}`),

  getNearbySpots: (lat: number, lng: number, radius?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (radius) params.append('radius', radius.toString());
    if (limit) params.append('limit', limit.toString());
    return apiClient.get(`/spots/nearby/${lat}/${lng}?${params.toString()}`);
  },
};

// Bookings API
export const bookingsAPI = {
  getBookings: (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      // Check if value exists and is not empty
      if (value !== undefined && value !== null && String(value) !== '') {
        queryParams.append(key, String(value));
      }
    });
    return apiClient.get(`/bookings?${queryParams.toString()}`);
  },

  getBookingById: (bookingId: string) =>
    apiClient.get(`/bookings/${bookingId}`),

  createBooking: (bookingData: {
    parkingSpot: string;
    startTime: string;
    endTime: string;
    vehicleInfo: {
      licensePlate: string;
      make?: string;
      model?: string;
      color?: string;
    };
    notes?: string;
  }) =>
    apiClient.post('/bookings', bookingData),

  updateBooking: (bookingId: string, bookingData: any) =>
    apiClient.put(`/bookings/${bookingId}`, bookingData),

  cancelBooking: (bookingId: string) =>
    apiClient.patch(`/bookings/${bookingId}/cancel`),

  completeBooking: (bookingId: string) =>
    apiClient.patch(`/bookings/${bookingId}/complete`),

  deleteBooking: (bookingId: string) =>
    apiClient.delete(`/bookings/${bookingId}`),

  getSpotBookings: (spotId: string, params: { page?: number; limit?: number } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      // Check if value exists and is not empty
      if (value !== undefined && value !== null && String(value) !== '') {
        queryParams.append(key, String(value));
      }
    });
    return apiClient.get(`/bookings/spot/${spotId}?${queryParams.toString()}`);
  },
};

// Dashboard API
export interface DashboardData {
  totalUsers: number;
  activeSessionsToday: number;
  recentUsersChange: number;
  sessionActivity: Array<{
    date: string;
    count: number;
  }>;
  userGrowth: Array<{
    month: string;
    count: number;
  }>;
  parkingSpots: {
    available: number;
    occupied: number;
    maintenance: number;
    total: number;
  };
  recentBookings: Array<any>;
  earningsData: Array<{
    month: string;
    earnings: number;
  }>;
}

export const dashboardAPI = {
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  }
};

// Health check API
export const healthAPI = {
  check: () => apiClient.get('/health'),
};

// Payments API
export const paymentsAPI = {
  getPayments: (params: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value) !== '') {
        queryParams.append(key, String(value));
      }
    });
    return apiClient.get(`/payments?${queryParams.toString()}`);
  },

  getPaymentById: (paymentId: string) =>
    apiClient.get(`/payments/${paymentId}`),

  getPaymentReceipt: (paymentId: string) =>
    apiClient.get(`/payments/${paymentId}/receipt`),

  verifyKhaltiPayment: (paymentData: {
    token: string;
    amount: number;
    bookingId: string;
  }) =>
    apiClient.post('/payments/verify-khalti', paymentData),

  getPaymentAnalytics: (params: {
    startDate?: string;
    endDate?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value) !== '') {
        queryParams.append(key, String(value));
      }
    });
    return apiClient.get(`/payments/analytics?${queryParams.toString()}`);
  }
};

// Export the configured axios instance for custom requests
export default apiClient;