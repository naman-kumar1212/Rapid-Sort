import axios, { AxiosResponse } from 'axios';
import {
  CreateProductData,
  UpdateProductData,
  ProductsResponse,
  ProductResponse,
  BulkCreateResponse,
  BulkDeleteResponse,
  HealthResponse,
  ProductFilters,
} from '../types/Product';

// Configure base URL for the backend API
const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', config.url);
    } else {
      console.log('No token found for request:', config.url);
    }
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Backend server is not running or not accessible');
    } else if (error.response?.status === 401) {
      console.error('❌ Authentication failed');
      // Clear token if authentication fails
      localStorage.removeItem('token');
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Product API functions
export const productAPI = {
  // Get all products with optional filters
  getProducts: (params: ProductFilters = {}): Promise<AxiosResponse<ProductsResponse>> => {
    return api.get('/products', { params });
  },

  // Get single product by ID
  getProductById: (id: string): Promise<AxiosResponse<ProductResponse>> => {
    return api.get(`/products/${id}`);
  },

  // Create new product
  createProduct: (productData: CreateProductData): Promise<AxiosResponse<ProductResponse>> => {
    return api.post('/products', productData);
  },

  // Update product
  updateProduct: (id: string, productData: UpdateProductData): Promise<AxiosResponse<ProductResponse>> => {
    return api.put(`/products/${id}`, productData);
  },

  // Delete product
  deleteProduct: (id: string): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
    return api.delete(`/products/${id}`);
  },

  // Bulk create products
  bulkCreateProducts: (products: CreateProductData[]): Promise<AxiosResponse<BulkCreateResponse>> => {
    return api.post('/products/bulk', { products });
  },

  // Bulk delete products
  bulkDeleteProducts: (productIds: string[]): Promise<AxiosResponse<BulkDeleteResponse>> => {
    return api.delete('/products/bulk', { data: { productIds } });
  },

  // Health check
  healthCheck: (): Promise<AxiosResponse<HealthResponse>> => {
    return api.get('/health');
  }
};

// Export the api instance as apiClient for settings
export const apiClient = api;

export default api;