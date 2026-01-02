import { apiClient } from './api';

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  company?: string;
  role: string;
  department: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  notifications?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    orderAlerts?: boolean;
    lowStockAlerts?: boolean;
    customerAlerts?: boolean;
  };
  appearance?: {
    darkMode?: boolean;
    language?: string;
    timezone?: string;
    currency?: string;
    dateFormat?: string;
  };
  system?: {
    autoBackup?: boolean;
    sessionTimeout?: number;
  };
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  company?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
}

class SettingsApi {
  // Profile management
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get('/settings/profile');
    return response.data.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await apiClient.put('/settings/profile', data);
    return response.data.data;
  }

  async uploadAvatar(file: File): Promise<{ avatar: string; user: UserProfile }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.post('/settings/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await apiClient.put('/settings/password', data);
  }

  // Preferences management
  async getPreferences(): Promise<UserPreferences> {
    const response = await apiClient.get('/settings/preferences');
    return response.data.data;
  }

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const response = await apiClient.put('/settings/preferences', preferences);
    return response.data.data;
  }

  // Data export
  async exportData(format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const response = await apiClient.get(`/settings/export?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Account management
  async deleteAccount(data: DeleteAccountData): Promise<void> {
    await apiClient.delete('/settings/account', { data });
  }
}

export const settingsApi = new SettingsApi();