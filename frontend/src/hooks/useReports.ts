import { useState } from 'react';
import { reportsApi, ReportFilters, SalesReport, InventoryReport, CustomerReport, SupplierReport } from '../services/reportsApiFixed';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSalesReport = async (filters: ReportFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsApi.getSalesReport(filters);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sales report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getInventoryReport = async (filters: ReportFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsApi.getInventoryReport(filters);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch inventory report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCustomerReport = async (filters: ReportFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsApi.getCustomerReport(filters);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customer report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSupplierReport = async (filters: ReportFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsApi.getSupplierReport(filters);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch supplier report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (type: string, filters: ReportFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await reportsApi.exportReport(type, filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-report.${filters.format || 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to export report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRevenueAnalytics = async (period: string = '12months') => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsApi.getRevenueAnalytics(period);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch revenue analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getGrowthAnalytics = async (period: string = '12months') => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsApi.getGrowthAnalytics(period);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch growth analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getSalesReport,
    getInventoryReport,
    getCustomerReport,
    getSupplierReport,
    exportReport,
    getRevenueAnalytics,
    getGrowthAnalytics
  };
};