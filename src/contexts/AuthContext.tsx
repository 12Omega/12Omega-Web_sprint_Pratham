import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import axios, { isAxiosError } from 'axios'; // Axios used via apiClient
import { loginUser, getMe, setAuthToken, AuthResponse, FrontendUser } from '../services/api'; // Import from our API service

// FrontendUser is now imported from api.ts

interface AuthContextType {
  user: FrontendUser | null;
  login: (username: string, password: string) => Promise<void>; // Changed email to username
  logout: () => void;
  loading: boolean;
  token: string | null; // Added token to context if needed by other parts of app directly
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [token, setLocalToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken); // Set token for apiClient
        try {
          const response = await getMe(); // Use getMe from api.ts
          setUser(response.user as FrontendUser); // Cast to FrontendUser
        } catch (error) {
          console.error("Failed to fetch user with stored token", error);
          localStorage.removeItem('token');
          setAuthToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []); // Run once on mount

  const login = async (username: string, password: string) => { // Changed email to username
    try {
      setLoading(true);
      const response: AuthResponse = await loginUser({ username, password }); // Use loginUser from api.ts
      
      localStorage.setItem('token', response.token);
      setAuthToken(response.token); // Set token for future apiClient requests
      setLocalToken(response.token);
      setUser(response.user as FrontendUser); // Cast to FrontendUser
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      // Error handling is now more centralized in api.ts or component, but can re-throw or set local error state
      throw err; // Re-throw to be caught by LoginPage
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null); // Clear token in apiClient
    setLocalToken(null);
    setUser(null);
    // Optionally, redirect here or let calling component handle it
    // navigate('/login'); // If navigate is available here
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};