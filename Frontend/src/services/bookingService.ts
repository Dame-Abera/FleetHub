import { apiClient } from './apiClient';

export interface Booking {
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  car: {
    id: string;
    name: string;
    brand: string;
    year?: number;
    images: string[];
    postedBy: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateBookingData {
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  notes?: string;
}

export interface UpdateBookingData {
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
}

export interface BookingFilters {
  status?: string;
  carId?: string;
  page?: number;
  limit?: number;
}

export interface BookingsResponse {
  data: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CarAvailability {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
}

class BookingService {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  }

  async getBookings(filters?: BookingFilters): Promise<BookingsResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.carId) params.append('carId', filters.carId);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await apiClient.get(`/bookings?${params.toString()}`);
      console.log('Bookings API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async getBooking(id: string): Promise<Booking> {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  }

  async updateBooking(id: string, data: UpdateBookingData): Promise<Booking> {
    const response = await apiClient.patch(`/bookings/${id}`, data);
    return response.data;
  }

  async deleteBooking(id: string): Promise<void> {
    await apiClient.delete(`/bookings/${id}`);
  }

  async getCarAvailability(
    carId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<CarAvailability[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(`/bookings/car/${carId}/availability?${params.toString()}`);
    return response.data;
  }

  // Helper method to calculate total price
  calculateTotalPrice(pricePerDay: number, startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return pricePerDay * days;
  }

  // Helper method to check if dates are valid
  validateDates(startDate: string, endDate: string): { isValid: boolean; error?: string } {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return { isValid: false, error: 'Start date cannot be in the past' };
    }

    if (end <= start) {
      return { isValid: false, error: 'End date must be after start date' };
    }

    return { isValid: true };
  }

  // Helper method to format date for display
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Helper method to get status color
  getStatusColor(status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  }
}

export const bookingService = new BookingService();

