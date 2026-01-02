/**
 * Real-time Notifications Component
 * 
 * Displays WebSocket-powered notifications for:
 * - New orders
 * - Low stock alerts
 * - Inventory updates
 */
import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  ShoppingCart as OrderIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface Notification {
  id: number;
  type: 'order' | 'warning' | 'inventory';
  message: string;
  timestamp: string;
  read?: boolean;
}

const RealTimeNotifications: React.FC = () => {
  const { isConnected } = useWebSocketContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Listen for WebSocket events
    const handleNewOrder = (event: CustomEvent) => {
      const orderData = event.detail;
      addNotification({
        type: 'order',
        message: `New order #${orderData.orderNumber || 'N/A'} received`,
        timestamp: new Date().toISOString()
      });
    };

    const handleLowStock = (event: CustomEvent) => {
      const productData = event.detail;
      addNotification({
        type: 'warning',
        message: `Low stock alert: ${productData.name} (${productData.quantity} remaining)`,
        timestamp: new Date().toISOString()
      });
    };

    const handleInventoryUpdate = (event: CustomEvent) => {
      const productData = event.detail;
      if (!productData.deleted) {
        addNotification({
          type: 'inventory',
          message: `Product updated: ${productData.name}`,
          timestamp: new Date().toISOString()
        });
      } else {
        addNotification({
          type: 'inventory',
          message: `Product deleted: ${productData.name}`,
          timestamp: new Date().toISOString()
        });
      }
    };

    // Add event listeners
    window.addEventListener('newOrder', handleNewOrder as EventListener);
    window.addEventListener('lowStockAlert', handleLowStock as EventListener);
    window.addEventListener('inventoryUpdate', handleInventoryUpdate as EventListener);

    return () => {
      window.removeEventListener('newOrder', handleNewOrder as EventListener);
      window.removeEventListener('lowStockAlert', handleLowStock as EventListener);
      window.removeEventListener('inventoryUpdate', handleInventoryUpdate as EventListener);
    };
  }, []);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep only 20 notifications
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
    handleClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <OrderIcon color="primary" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'inventory':
        return <InventoryIcon color="info" />;
      default:
        return <CircleIcon />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
        {isConnected && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'success.main',
              border: '1px solid white'
            }}
          />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            overflow: 'auto'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Notifications
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                size="small"
                label={isConnected ? 'Live' : 'Offline'}
                color={isConnected ? 'success' : 'default'}
                variant="outlined"
              />
              {notifications.length > 0 && (
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ cursor: 'pointer' }}
                  onClick={clearAll}
                >
                  Clear all
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </MenuItem>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: notification.read ? 'transparent' : 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.selected'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: notification.read ? 'normal' : 'medium'
                      }}
                    >
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(notification.timestamp)}
                    </Typography>
                  }
                />
                {!notification.read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      ml: 1
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default RealTimeNotifications;