import { apiClient } from './api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  parentCategory?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  parentCategory?: string;
  isActive?: boolean;
}

export interface CategoryFilters {
  isActive?: boolean;
  parentCategory?: string;
  name?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class CategoriesApi {
  async getCategories(filters: CategoryFilters = {}): Promise<{ success: boolean; data: Category[]; pagination: any }> {
    const response = await apiClient.get('/categories', { params: filters });
    return response.data;
  }

  async getCategoryById(id: string): Promise<{ success: boolean; data: Category }> {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  }

  async createCategory(data: CreateCategoryData): Promise<{ success: boolean; data: Category; message: string }> {
    const response = await apiClient.post('/categories', data);
    return response.data;
  }

  async updateCategory(id: string, data: UpdateCategoryData): Promise<{ success: boolean; data: Category; message: string }> {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  }

  async getCategoryTree(): Promise<{ success: boolean; data: Category[] }> {
    const response = await apiClient.get('/categories/tree');
    return response.data;
  }
}

export const categoriesApi = new CategoriesApi();