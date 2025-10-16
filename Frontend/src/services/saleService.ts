import { apiClient } from './apiClient';

export interface CreateSaleRequest {
  carId: string;
  price: number;
  notes?: string;
}

export interface SaleTransaction {
  id: string;
  carId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  date: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  car: {
    id: string;
    name: string;
    brand: string;
    year: number;
    images: string[];
    postedBy: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
  buyer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  seller: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface SalesResponse {
  data: SaleTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const createSale = async (saleData: CreateSaleRequest): Promise<SaleTransaction> => {
  const response = await apiClient.post('/sales', saleData);
  return response.data;
};

export const getSales = async (params?: {
  page?: number;
  limit?: number;
  carId?: string;
}): Promise<SalesResponse> => {
  const response = await apiClient.get('/sales', { params });
  return response.data;
};

export const getSaleById = async (id: string): Promise<SaleTransaction> => {
  const response = await apiClient.get(`/sales/${id}`);
  return response.data;
};

export const updateSale = async (id: string, updateData: Partial<CreateSaleRequest>): Promise<SaleTransaction> => {
  const response = await apiClient.patch(`/sales/${id}`, updateData);
  return response.data;
};

export const deleteSale = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/sales/${id}`);
  return response.data;
};

export const confirmSale = async (id: string): Promise<SaleTransaction> => {
  const response = await apiClient.post(`/sales/${id}/confirm`);
  return response.data;
};

export const rejectSale = async (id: string, reason?: string): Promise<{ message: string; reason?: string }> => {
  const response = await apiClient.post(`/sales/${id}/reject`, { reason });
  return response.data;
};
