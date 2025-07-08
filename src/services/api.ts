import axios from 'axios';
import { IUser } from '../models/User'; // Assuming server models can be referenced or duplicated for frontend types
import { IProduct } from '../models/Product'; // Same assumption

// --- Axios Instance Setup ---
const apiClient = axios.create({
  baseURL: '/api', // All API calls will be prefixed with /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Interceptor to add JWT token to requests
// This would typically be set up after login, using a token from AuthContext or localStorage
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// --- Auth Service ---
interface LoginCredentials {
  username?: string; 
  password?: string;
}

// Frontend User type, should omit password and align with what /me and login returns
// This IUser is imported from backend models, which isn't ideal.
// For now, we'll use Omit, but a dedicated frontend type is better.
type FrontendUser = Omit<IUser, 'password'> & { _id: string }; // Ensure _id is string

interface AuthResponse {
  token: string;
  user: FrontendUser; // Backend login now returns a user object
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials); // Specify response type
  return response.data;
};

interface GetMeResponse {
    user: FrontendUser;
}

export const getMe = async (): Promise<GetMeResponse> => {
    // Assumes token is already set in apiClient by AuthProvider
    const response = await apiClient.get<GetMeResponse>('/auth/me');
    return response.data;
};

interface RegisterData {
  username?: string;
  email?: string;
  password?: string;
}

interface RegisterResponse {
    message: string;
    user: Omit<IUser, 'password'>;
}

export const registerUser = async (userData: RegisterData): Promise<RegisterResponse> => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};


// --- Dashboard Service ---
// Matches the backend /api/dashboard/history response (simplified for now)
export interface UserGrowthData {
    date: string;
    count: number;
}
export interface SessionActivityData {
    date: string;
    activeSessions: number;
}
export interface DashboardData {
  totalUsers: number;
  activeSessionsToday: number; // Renamed from activeSessions
  recentUsersChange: string; // Renamed from recentUsers and changed type
  userGrowth: UserGrowthData[];
  sessionActivity: SessionActivityData[];
  userRole?: 'admin' | 'manager' | 'host' | 'guest'; // Optional role from backend
  queryReceived?: { start?: string; end?: string };
}

export const getDashboardData = async (startDate?: string, endDate?: string): Promise<DashboardData> => {
  const params: any = {};
  if (startDate) params.start = startDate;
  if (endDate) params.end = endDate;
  const response = await apiClient.get('/dashboard/history', { params });
  return response.data;
};


// --- Product Service ---
interface ProductQueryParams {
  category?: string; brand?: string; status?: string;
  minPrice?: number; maxPrice?: number; search?: string;
  sortBy?: string; sortOrder?: 'asc' | 'desc';
  page?: number; limit?: number;
}

interface PaginatedProducts {
  data: IProduct[]; // Assuming IProduct is the detailed product type
  pagination: {
    currentPage: number; totalPages: number;
    totalProducts: number; limit: number;
  };
  _links?: any; // For HATEOAS
}

export const getProducts = async (params?: ProductQueryParams): Promise<PaginatedProducts> => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) return null;
    throw error;
  }
};

export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  // Token should be set globally via setAuthToken or an interceptor from AuthContext
  const response = await apiClient.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id: string, productData: Partial<IProduct>): Promise<IProduct> => {
  const response = await apiClient.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<{ message: string; product: IProduct }> => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

// --- User Service ---
interface UserQueryParams {
  role?: string; isActive?: boolean; search?: string;
  sortBy?: string; sortOrder?: 'asc' | 'desc';
  page?: number; limit?: number;
}

// IUser from ../models/User might include password. Frontend should use a type that omits it.
type IUserFrontend = Omit<IUser, 'password'>;

interface PaginatedUsers {
  data: IUserFrontend[];
  pagination: {
    currentPage: number; totalPages: number;
    totalUsers: number; limit: number;
  };
  _links?: any;
}

export const getUsers = async (params?: UserQueryParams): Promise<PaginatedUsers> => {
  // Token should be set globally
  const response = await apiClient.get('/users', { params });
  return response.data;
};

export const getUserById = async (id: string): Promise<IUserFrontend | null> => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) return null;
    throw error;
  }
};

// For admin creating user, password is required. Role, etc., are optional.
export const createUser = async (userData: Partial<IUser>): Promise<IUserFrontend> => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: Partial<IUser>): Promise<IUserFrontend> => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<{ message: string; user: IUserFrontend }> => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

// Note: For a real app, types/interfaces for API responses (IProduct, IUser from backend)
// should ideally be shared or duplicated accurately on the frontend.
// For IUser, the backend model has password, but frontend types for user data should omit it.
// The Omit<IUser, 'password'> example in RegisterResponse is a good pattern.
