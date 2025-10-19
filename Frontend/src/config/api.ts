// API Configuration
// This file centralizes all API-related configuration

// Get the API base URL from environment variable or use default
// For production, always use the remote backend
const isProduction = import.meta.env.PROD || import.meta.env.VITE_NODE_ENV === 'production';
export const API_BASE_URL = isProduction 
  ? 'https://fleethub-backend.onrender.com'
  : (import.meta.env.VITE_API_URL || 'https://fleethub-backend.onrender.com');

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Car endpoints
  CARS: '/cars',
  CAR_BY_ID: (id: string) => `/cars/${id}`,
  CARS_FOR_SALE: '/cars?availableForSale=true',
  CARS_FOR_RENTAL: '/cars?availableForRental=true',
  
  // User endpoints
  USER_BY_ID: (id: string) => `/users/${id}`,
  PROFILE: '/users/profile',
  
  // Dashboard endpoints
  DASHBOARD_STATS: '/dashboard/stats',
  
  // Booking endpoints
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
  
  // Review endpoints
  REVIEWS: '/reviews',
  REVIEWS_BY_CAR: (carId: string) => `/reviews/car/${carId}`,
  
  // Sale endpoints
  SALES: '/sales',
  SALE_BY_ID: (id: string) => `/sales/${id}`,
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to get API base URL
export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};
