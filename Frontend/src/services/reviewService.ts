import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface Review {
  id: string;
  carId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
  };
  reviewee: {
    id: string;
    name: string;
    avatar?: string;
  };
  car: {
    id: string;
    name: string;
    brand: string;
    year: number;
  };
}

export interface CreateReviewData {
  carId: string;
  revieweeId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  minRating: number;
  maxRating: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
  }>;
}

export interface ReviewsResponse {
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ReviewService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async createReview(data: CreateReviewData): Promise<Review> {
    const response = await axios.post(`${API_BASE_URL}/reviews`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getReviews(filters?: {
    carId?: string;
    revieweeId?: string;
    reviewerId?: string;
    rating?: number;
    page?: number;
    limit?: number;
  }): Promise<ReviewsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await axios.get(`${API_BASE_URL}/reviews?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getReviewsByCar(carId: string): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/car/${carId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews by car:', error);
      throw error;
    }
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    const response = await axios.get(`${API_BASE_URL}/reviews/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getReviewStats(userId: string): Promise<ReviewStats> {
    const response = await axios.get(`${API_BASE_URL}/reviews/stats/${userId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getCarReviewStats(carId: string): Promise<ReviewStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/car-stats/${carId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching car review stats:', error);
      throw error;
    }
  }

  async getReview(id: string): Promise<Review> {
    const response = await axios.get(`${API_BASE_URL}/reviews/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updateReview(id: string, data: UpdateReviewData): Promise<Review> {
    const response = await axios.patch(`${API_BASE_URL}/reviews/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deleteReview(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/reviews/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async getFeaturedReviews(limit: number = 5): Promise<Review[]> {
    const response = await axios.get(`${API_BASE_URL}/reviews/recent/featured?limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const reviewService = new ReviewService();
