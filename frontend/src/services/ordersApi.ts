import { apiClient } from './api';

export interface OrderItem {
  product: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: {
    product: string;
    quantity: number;
    unitPrice: number;
  }[];
  expectedDelivery?: string;
  notes?: string;
}

export interface UpdateOrderData {
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  status?: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  customer?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class OrdersApi {
  async getOrders(filters: OrderFilters = {}): Promise<{ success: boolean; data: Order[]; pagination: any }> {
    const response = await apiClient.get('/orders', { params: filters });
    return response.data;
  }

  async getOrderById(id: string): Promise<{ success: boolean; data: Order }> {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(data: CreateOrderData): Promise<{ success: boolean; data: Order; message: string }> {
    const response = await apiClient.post('/orders', data);
    return response.data;
  }

  async updateOrder(id: string, data: UpdateOrderData): Promise<{ success: boolean; data: Order; message: string }> {
    const response = await apiClient.put(`/orders/${id}`, data);
    return response.data;
  }

  async deleteOrder(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  }

  async getOrderStats(): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.get('/orders/stats');
    return response.data;
  }
}

export const ordersApi = new OrdersApi();