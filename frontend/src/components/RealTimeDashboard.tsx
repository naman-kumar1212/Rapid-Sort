/**
 * Real-time Dashboard Component
 * 
 * Shows live inventory and order statistics with WebSocket updates
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrderIcon,
  Warning as WarningIcon,
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon
} from '@mui/icons-material';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface LiveStats {
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: number;
  lastUpdate: string;
}

interface RecentActivity {
  id: string;
  type: 'inventory' | 'order' | 'alert';
  message: string;
  timestamp: string;
}

const RealTimeDashboard: React.FC = () => {
  const { isConnected } = useWebSocketContext();
  const [liveStats, setLiveStats] = useState<LiveStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    recentOrders: 0,
    lastUpdate: new Date().toISOString()
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Listen for real-time updates
    const handleInventoryUpdate = (event: CustomEvent) => {
      const productData = event.detail;
      
      // Update stats
      setLiveStats(prev => ({
        ...prev,
        lastUpdate: new Date().toISOString()
      }));

      // Add to recent activity
      addActivity({
        type: 'inventory',
        message: productData.deleted 
          ? `Product deleted: ${productData.name}`
          : `Product updated: ${productData.name}`,
        timestamp: new Date().toISOString()
      });
    };

    const handleNewOrder = (event: CustomEvent) => {
      const orderData = event.detail;
      
      // Update stats
      setLiveStats(prev => ({
        ...prev,
        recentOrders: prev.recentOrders + 1,
        lastUpdate: new Date().toISOString()
      }));

      // Add to recent activity
      addActivity({
        type: 'order',
        message: `New order received: #${orderData.orderNumber || 'N/A'}`,
        timestamp: new Date().toISOString()
      });
    };

    const handleLowStock = (event: CustomEvent) => {
      const productData = event.detail;
      
      // Update stats
      setLiveStats(prev => ({
        ...prev,
        lowStockProducts: prev.lowStockProducts + 1,
        lastUpdate: new Date().toISOString()
      }));

      // Add to recent activity
      addActivity({
        type: 'alert',
        message: `Low stock alert: ${productData.name} (${productData.quantity} remaining)`,
        timestamp: new Date().toISOString()
      });
    };

    // Add event listeners
    window.addEventListener('inventoryUpdate', handleInventoryUpdate as EventListener);
    window.addEventListener('newOrder', handleNewOrder as EventListener);
    window.addEventListener('lowStockAlert', handleLowStock as EventListener);

    return () => {
      window.removeEventListener('inventoryUpdate', handleInventoryUpdate as EventListener);
      window.removeEventListener('newOrder', handleNewOrder as EventListener);
      window.removeEventListener('lowStockAlert', handleLowStock as EventListener);
    };
  }, []);

  const addActivity = (activity: Omit<RecentActivity, 'id'>) => {
    const newActivity: RecentActivity = {
      ...activity,
      id: Date.now().toString()
    };

    setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 activities
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return <InventoryIcon color="info" />;
      case 'order':
        return <OrderIcon color="success" />;
      case 'alert':
        return <WarningIcon color="warning" />;
      default:
        return <InventoryIcon />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <Grid container spacing={3}>
      {/* Connection Status */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">
                Real-time Dashboard
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  icon={isConnected ? <ConnectedIcon /> : <DisconnectedIcon />}
                  label={isConnected ? 'Connected' : 'Disconnected'}
                  color={isConnected ? 'success' : 'error'}
                  variant="outlined"
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  Last update: {formatTime(liveStats.lastUpdate)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Live Stats */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <InventoryIcon color="primary" />
              <Box>
                <Typography variant="h4">
                  {liveStats.totalProducts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Products
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <OrderIcon color="success" />
              <Box>
                <Typography variant="h4">
                  {liveStats.recentOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recent Orders
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <WarningIcon color="warning" />
              <Box>
                <Typography variant="h4">
                  {liveStats.lowStockProducts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Low Stock Alerts
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {recentActivity.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No recent activity. Real-time updates will appear here.
              </Typography>
            ) : (
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={formatTime(activity.timestamp)}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RealTimeDashboard;