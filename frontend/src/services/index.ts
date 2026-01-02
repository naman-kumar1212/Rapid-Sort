// Export all API services
export * from './api';
export * from './authApi';
export * from './ordersApi';
export * from './suppliersApi';
export * from './categoriesApi';
export * from './dashboardApi';
export * from './reportsApiFixed';
export * from './usersApi';
export * from './settingsApi';

// Export all hooks (excluding useAuth to avoid conflict)
export { useAuthState } from '../hooks/useAuth';
export * from '../hooks/useOrders';
export * from '../hooks/useSuppliers';
export * from '../hooks/useDashboard';
export * from '../hooks/useReports';
export * from '../hooks/useSettings';

// Export contexts (this includes the main useAuth hook)
export { AuthProvider, useAuth } from '../contexts/AuthContext';