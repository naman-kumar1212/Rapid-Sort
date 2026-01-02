import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  ShoppingCart,
  People,
  AttachMoney,
  Warning,
  CheckCircle,
  MoreVert,
  Visibility,
} from '@mui/icons-material';
import { useDashboard } from '../hooks/useDashboard';
import RealTimeDashboard from '../components/RealTimeDashboard';

const Dashboard: React.FC = () => {
  const { data, loading, error, refetch } = useDashboard();

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactElement;
    trend?: number;
    color: string;
  }> = ({ title, value, icon, trend, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend > 0 ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={trend > 0 ? 'success.main' : 'error.main'}
                  ml={0.5}
                >
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'success';
      case 'pending':
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'shipped':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={refetch} variant="contained">
          Retry
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Alert severity="info">
          No dashboard data available
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Welcome back! Here's what's happening with your store today.
      </Typography>

      {/* Real-time Dashboard */}
      <Box mb={4}>
        <RealTimeDashboard />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={data.counts?.products?.toLocaleString() || '0'}
            icon={<Inventory />}
            trend={undefined}
            color="#6366f1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={data.counts?.orders?.toLocaleString() || '0'}
            icon={<ShoppingCart />}
            trend={undefined}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Suppliers"
            value={data.counts?.suppliers?.toLocaleString() || '0'}
            icon={<People />}
            trend={undefined}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={`$${data.inventory?.totalValue?.toLocaleString() || '0'}`}
            icon={<AttachMoney />}
            trend={undefined}
            color="#ec4899"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Orders
                </Typography>
                <Button size="small" endIcon={<Visibility />}>
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order Number</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data.recentOrders || []).map((order: any) => (
                      <TableRow key={order._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {order.orderNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status) as any}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts & Low Stock */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Alerts & Notifications
              </Typography>

              {/* Low Stock Alert */}
              <Box mb={3}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Warning color="warning" fontSize="small" />
                  <Typography variant="subtitle2" ml={1} fontWeight="medium">
                    Low Stock Items ({data.inventory?.lowStockCount || 0})
                  </Typography>
                </Box>
                {data.inventory?.lowStockCount > 0 ? (
                  <Box mb={1} p={1} bgcolor="warning.light" borderRadius={1}>
                    <Typography variant="body2" fontWeight="medium">
                      {data.inventory.lowStockCount} products need attention
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Check inventory for low stock items
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    All products are well stocked! 🎉
                  </Typography>
                )}
              </Box>

              {/* Pending Orders Alert */}
              <Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <CheckCircle color="info" fontSize="small" />
                  <Typography variant="subtitle2" ml={1} fontWeight="medium">
                    Pending Orders ({data.counts?.orders || 0})
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  You have {data.counts?.orders || 0} orders in the system.
                </Typography>
                <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                  Process Orders
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;