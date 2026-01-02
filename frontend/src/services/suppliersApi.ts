import { apiClient } from './api';

export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website?: string;
  taxId?: string;
  paymentTerms: string;
  status: 'active' | 'inactive' | 'suspended';
  rating?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website?: string;
  taxId?: string;
  paymentTerms: string;
  rating?: number;
  notes?: string;
}

export interface UpdateSupplierData {
  name?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  status?: string;
  rating?: number;
  notes?: string;
}

export interface SupplierFilters {
  status?: string;
  name?: string;
  city?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class SuppliersApi {
  async getSuppliers(filters: SupplierFilters = {}): Promise<{ success: boolean; data: Supplier[]; pagination: any }> {
    const response = await apiClient.get('/suppliers', { params: filters });
    return response.data;
  }

  async getSupplierById(id: string): Promise<{ success: boolean; data: Supplier }> {
    const response = await apiClient.get(`/suppliers/${id}`);
    return response.data;
  }

  async createSupplier(data: CreateSupplierData): Promise<{ success: boolean; data: Supplier; message: string }> {
    const response = await apiClient.post('/suppliers', data);
    return response.data;
  }

  async updateSupplier(id: string, data: UpdateSupplierData): Promise<{ success: boolean; data: Supplier; message: string }> {
    const response = await apiClient.put(`/suppliers/${id}`, data);
    return response.data;
  }

  async deleteSupplier(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/suppliers/${id}`);
    return response.data;
  }

  async getSupplierStats(): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.get('/suppliers/stats');
    return response.data;
  }
}

export const suppliersApi = new SuppliersApi();