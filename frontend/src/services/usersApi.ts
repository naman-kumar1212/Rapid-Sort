import { apiClient } from './api';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: 'inventory' | 'sales' | 'purchasing' | 'warehouse' | 'management';
  phone?: string;
  avatar?: string;
  position?: string;
  company?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  department: string;
  phone?: string;
  position?: string;
  company?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  department?: string;
  phone?: string;
  position?: string;
  company?: string;
  isActive?: boolean;
}

export interface UserFilters {
  role?: string;
  department?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class UsersApi {
  async getUsers(filters: UserFilters = {}): Promise<{ success: boolean; data: User[]; pagination: any }> {
    const response = await apiClient.get('/users', { params: filters });
    return response.data;
  }

  async getUserById(id: string): Promise<{ success: boolean; data: User }> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserData): Promise<{ success: boolean; data: User; message: string }> {
    const response = await apiClient.post('/users', data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserData): Promise<{ success: boolean; data: User; message: string }> {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }

  async activateUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(`/users/${id}/activate`);
    return response.data;
  }

  async deactivateUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(`/users/${id}/deactivate`);
    return response.data;
  }

  async resetPassword(id: string): Promise<{ success: boolean; message: string; tempPassword: string }> {
    const response = await apiClient.put(`/users/${id}/reset-password`);
    return response.data;
  }

  async getUserStats(): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.get('/users/stats');
    return response.data;
  }
}

export const usersApi = new UsersApi();