import { apiClient } from './api';

export interface LoginData {
  email: string;
  password: string;
  role?: string; // Optional role selection for login
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
  phone?: string;
}

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

class AuthApi {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  }

  async getMe(): Promise<{ success: boolean; data: AuthUser }> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put('/auth/change-password', data);
    return response.data;
  }
}

export const authApi = new AuthApi();