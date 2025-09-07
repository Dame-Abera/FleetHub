import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:3001';

interface User {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  user: User;
  access_token: string;
  token_type: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: UpdateProfileData) => Promise<void>;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user info
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, password: '***' });
      console.log('API Base URL:', axios.defaults.baseURL);
      
      const response = await axios.post<LoginResponse>('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(user);
    } catch (error: any) {
      console.error('Login failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post<LoginResponse>('/auth/register', userData);
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(user);
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (userData: UpdateProfileData) => {
    try {
      console.log('Updating profile with:', userData);
      const response = await axios.patch<User>('/auth/profile', userData);
      console.log('Profile updated:', response.data);
      setUser(response.data);
    } catch (error: any) {
      console.error('Profile update failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await axios.get<User>('/auth/profile');
      setUser(response.data);
    } catch (error: any) {
      console.error('Failed to refresh profile:', error);
      // Don't throw error here as it's used for background refresh
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};