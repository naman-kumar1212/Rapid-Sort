import { useState, useEffect } from 'react';
import { suppliersApi, Supplier, CreateSupplierData, UpdateSupplierData, SupplierFilters } from '../services/suppliersApi';

export const useSuppliers = (filters: SupplierFilters = {}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await suppliersApi.getSuppliers(filters);
      setSuppliers(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (data: CreateSupplierData) => {
    try {
      setError(null);
      const response = await suppliersApi.createSupplier(data);
      setSuppliers(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create supplier');
      throw err;
    }
  };

  const updateSupplier = async (id: string, data: UpdateSupplierData) => {
    try {
      setError(null);
      const response = await suppliersApi.updateSupplier(id, data);
      setSuppliers(prev => prev.map(supplier => 
        supplier._id === id ? response.data : supplier
      ));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update supplier');
      throw err;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      setError(null);
      await suppliersApi.deleteSupplier(id);
      setSuppliers(prev => prev.filter(supplier => supplier._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete supplier');
      throw err;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [JSON.stringify(filters)]);

  return {
    suppliers,
    loading,
    error,
    pagination,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers
  };
};

export const useSupplier = (id: string) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplier = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await suppliersApi.getSupplierById(id);
      setSupplier(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch supplier');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  return {
    supplier,
    loading,
    error,
    refetch: fetchSupplier
  };
};