export interface Product {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
  description?: string;
  supplier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  description?: string;
  supplier?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface BulkCreateResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface BulkDeleteResponse {
  success: boolean;
  message: string;
  deletedCount: number;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  database: {
    type: string;
    status: string;
  };
  timestamp: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  name?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
}

export interface StockStatus {
  label: string;
  color: 'success' | 'warning' | 'error';
}