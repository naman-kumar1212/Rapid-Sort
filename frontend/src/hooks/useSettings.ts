import { useState, useEffect } from 'react';
import { settingsApi, UserProfile, UserPreferences, UpdateProfileData, ChangePasswordData } from '../services/settingsApi';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsApi.getProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setError(null);
      const updatedProfile = await settingsApi.updateProfile(data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setError(null);
      const result = await settingsApi.uploadAvatar(file);
      setProfile(result.user);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload avatar');
      throw err;
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    try {
      setError(null);
      await settingsApi.changePassword(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    changePassword,
    refetch: fetchProfile
  };
};

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsApi.getPreferences();
      setPreferences(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      setError(null);
      const updatedPreferences = await settingsApi.updatePreferences(newPreferences);
      setPreferences(updatedPreferences);
      return updatedPreferences;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update preferences');
      throw err;
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refetch: fetchPreferences
  };
};

export const useDataExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async (format: 'json' | 'csv' = 'json') => {
    try {
      setLoading(true);
      setError(null);
      const blob = await settingsApi.exportData(format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to export data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    exportData,
    loading,
    error
  };
};

export const useAccountDeletion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = async (password: string) => {
    try {
      setLoading(true);
      setError(null);
      await settingsApi.deleteAccount({ password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteAccount,
    loading,
    error
  };
};