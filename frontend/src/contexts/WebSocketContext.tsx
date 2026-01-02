/**
 * WebSocket Context for React Application
 * 
 * Provides WebSocket connection management and real-time updates
 * throughout the application using React Context API
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (messageType: string, handler: (data: any) => void) => () => void;
  send: (type: string, data?: any) => void;
  subscribeToChannel: (channel: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { isConnected, subscribe, send, subscribeToChannel } = useWebSocket();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected) {
      // Subscribe to inventory updates
      const unsubscribeInventory = subscribe('inventory_update', (data) => {
        console.log('📦 Inventory update received:', data);
        // Trigger a custom event for components to listen to
        window.dispatchEvent(new CustomEvent('inventoryUpdate', { detail: data }));
      });

      // Subscribe to new orders
      const unsubscribeOrders = subscribe('new_order', (data) => {
        console.log('🛒 New order received:', data);
        window.dispatchEvent(new CustomEvent('newOrder', { detail: data }));
        
        // Add to notifications
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'order',
          message: `New order #${data.orderNumber || 'N/A'}`,
          timestamp: new Date().toISOString()
        }]);
      });

      // Subscribe to low stock alerts
      const unsubscribeLowStock = subscribe('low_stock_alert', (data) => {
        console.log('⚠️ Low stock alert:', data);
        window.dispatchEvent(new CustomEvent('lowStockAlert', { detail: data }));
        
        // Add to notifications
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'warning',
          message: `Low stock: ${data.name} (${data.quantity} remaining)`,
          timestamp: new Date().toISOString()
        }]);
      });

      return () => {
        unsubscribeInventory();
        unsubscribeOrders();
        unsubscribeLowStock();
      };
    }
  }, [isConnected, subscribe]);

  const value: WebSocketContextType = {
    isConnected,
    subscribe,
    send,
    subscribeToChannel
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;