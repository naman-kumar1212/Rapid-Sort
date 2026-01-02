import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    path: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Add demo notifications on mount
  useEffect(() => {
    const demoNotifications: Notification[] = [
      {
        id: '1',
        title: 'Low Stock Alert',
        message: 'Product "Wireless Mouse" is running low. Only 5 units remaining.',
        type: 'warning',
        timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
        read: false,
        action: {
          label: 'View Product',
          path: '/products'
        }
      },
      {
        id: '2',
        title: 'New Order Received',
        message: 'Order #1234 has been placed by John Doe for $250.00',
        type: 'success',
        timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
        read: false,
        action: {
          label: 'View Order',
          path: '/orders'
        }
      },
      {
        id: '3',
        title: 'Supplier Update',
        message: 'Tech Supplies Co. has updated their product catalog with 15 new items.',
        type: 'info',
        timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
        read: true,
        action: {
          label: 'View Suppliers',
          path: '/suppliers'
        }
      },
      {
        id: '4',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2:00 AM. Expected downtime: 30 minutes.',
        type: 'info',
        timestamp: new Date(Date.now() - 5 * 3600000), // 5 hours ago
        read: true
      }
    ];
    
    setNotifications(demoNotifications);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};