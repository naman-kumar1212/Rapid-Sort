import { useState, useEffect } from 'react';
import { ordersApi, Order, CreateOrderData, UpdateOrderData, OrderFilters } from '../services/ordersApi';

export const useOrders = (filters: OrderFilters = {}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersApi.getOrders(filters);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (data: CreateOrderData) => {
    try {
      setError(null);
      const response = await ordersApi.createOrder(data);
      setOrders(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
      throw err;
    }
  };

  const updateOrder = async (id: string, data: UpdateOrderData) => {
    try {
      setError(null);
      const response = await ordersApi.updateOrder(id, data);
      setOrders(prev => prev.map(order => 
        order._id === id ? response.data : order
      ));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order');
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      setError(null);
      await ordersApi.deleteOrder(id);
      setOrders(prev => prev.filter(order => order._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete order');
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [JSON.stringify(filters)]);

  return {
    orders,
    loading,
    error,
    pagination,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch: fetchOrders
  };
};

export const useOrder = (id: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await ordersApi.getOrderById(id);
      setOrder(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder
  };
};