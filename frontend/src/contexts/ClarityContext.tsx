/**
 * Clarity Analytics Context
 * 
 * Provides Clarity analytics throughout the application
 */
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { clarityService } from '../services/clarity';
import { useAuth } from './AuthContext';

interface ClarityContextType {
  trackEvent: (eventName: string, metadata?: Record<string, any>) => void;
  trackAction: (action: string, details?: Record<string, any>) => void;
  trackProductInteraction: (action: 'view' | 'create' | 'update' | 'delete', productId?: string) => void;
  trackOrderInteraction: (action: 'create' | 'update' | 'view', orderId?: string) => void;
  trackSearch: (query: string, resultsCount: number) => void;
  trackExport: (type: 'pdf' | 'excel' | 'csv', dataType: string) => void;
}

const ClarityContext = createContext<ClarityContextType | undefined>(undefined);

interface ClarityProviderProps {
  children: ReactNode;
}

export const ClarityProvider: React.FC<ClarityProviderProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Track page views on route change
  useEffect(() => {
    const pageName = location.pathname.replace('/', '') || 'home';
    clarityService.trackPageView(pageName);
  }, [location]);

  // Set user ID when user logs in
  useEffect(() => {
    if (user?._id) {
      clarityService.setUserId(user._id);
      clarityService.setTag('user_role', user.role || 'user');
      clarityService.setTag('user_email', user.email || '');
    }
  }, [user]);

  const value: ClarityContextType = {
    trackEvent: clarityService.trackEvent.bind(clarityService),
    trackAction: clarityService.trackAction.bind(clarityService),
    trackProductInteraction: clarityService.trackProductInteraction.bind(clarityService),
    trackOrderInteraction: clarityService.trackOrderInteraction.bind(clarityService),
    trackSearch: clarityService.trackSearch.bind(clarityService),
    trackExport: clarityService.trackExport.bind(clarityService),
  };

  return (
    <ClarityContext.Provider value={value}>
      {children}
    </ClarityContext.Provider>
  );
};

export const useClarity = (): ClarityContextType => {
  const context = useContext(ClarityContext);
  if (context === undefined) {
    throw new Error('useClarity must be used within a ClarityProvider');
  }
  return context;
};

export default ClarityContext;