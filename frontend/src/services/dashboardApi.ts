import { apiClient } from './api';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockProducts: number;
  pendingOrders: number;
  monthlyRevenue: number;
  monthlyOrders: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  currentStock: number;
  minStockLevel: number;
  category: string;
}

export interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export interface DashboardData {
  stats: DashboardStats;
  revenueChart: RevenueData[];
  topProducts: TopProduct[];
  lowStockProducts: LowStockProduct[];
  recentOrders: RecentOrder[];
}

class DashboardApi {
  async getDashboardData(): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  }

  async getStats(): Promise<{ success: boolean; data: DashboardStats }> {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  }

  async getInventoryAnalytics(): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.get('/dashboard/inventory');
    return response.data;
  }

  async getSalesAnalytics(period: string = '30'): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.get(`/dashboard/sales?period=${period}`);
    return response.data;
  }

  async getAlerts(): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.get('/dashboard/alerts');
    return response.data;
  }

  // Legacy methods for backward compatibility
  async getRevenueChart(period: string = '30'): Promise<{ success: boolean; data: RevenueData[] }> {
    const response = await apiClient.get(`/dashboard/sales?period=${period}`);
    return {
      success: response.data.success,
      data: response.data.data.salesOverTime || []
    };
  }

  async getTopProducts(limit: number = 5): Promise<{ success: boolean; data: TopProduct[] }> {
    const response = await apiClient.get('/dashboard/overview');
    return {
      success: response.data.success,
      data: response.data.data.topProducts || []
    };
  }

  async getLowStockProducts(): Promise<{ success: boolean; data: LowStockProduct[] }> {
    const response = await apiClient.get('/dashboard/alerts');
    const lowStockAlerts = response.data.data.alerts.filter((alert: any) => alert.type === 'low_stock');
    return {
      success: response.data.success,
      data: lowStockAlerts.map((alert: any) => ({
        _id: alert.data._id,
        name: alert.data.name,
        currentStock: alert.data.quantity,
        minStockLevel: alert.data.minStockLevel,
        category: 'N/A'
      }))
    };
  }

  async getRecentOrders(limit: number = 10): Promise<{ success: boolean; data: RecentOrder[] }> {
    const response = await apiClient.get('/dashboard/overview');
    return {
      success: response.data.success,
      data: response.data.data.recentOrders || []
    };
  }
}

export const dashboardApi = new DashboardApi();