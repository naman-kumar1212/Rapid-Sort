import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Badge,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule,
} from '@mui/icons-material';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../services/ordersApi';

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Get orders with filters based on selected tab
  const getFilters = () => {
    const statusTabs = ['all', 'pending', 'processing', 'shipped', 'delivered'];
    const status = statusTabs[selectedTab];
    return status === 'all' ? {} : { status };
  };

  const { orders, loading, error, updateOrder, deleteOrder, refetch } = useOrders(getFilters());

  const statusTabs = [
    { label: 'All Orders', value: 'all', count: orders.length },
    { label: 'Pending', value: 'pending', count: orders.filter(o => o.status === 'pending').length },
    { label: 'Processing', value: 'processing', count: orders.filter(o => o.status === 'processing').length },
    { label: 'Shipped', value: 'shipped', count: orders.filter(o => o.status === 'shipped').length },
    { label: 'Delivered', value: 'delivered', count: orders.filter(o => o.status === 'delivered').length },
  ];

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle fontSize="small" />;
      case 'shipped':
        return <LocalShipping fontSize="small" />;
      case 'processing':
        return <Schedule fontSize="small" />;
      case 'cancelled':
        return <Cancel fontSize="small" />;
      default:
        return <Schedule fontSize="small" />;
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, order: Order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewOrder = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      handleMenuClose();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      handleMenuClose();
    } catch (error) {
      console.error('Failed to delete order:', error);
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Orders
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage and track all customer orders
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
        >
          New Order
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
            >
              Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            {statusTabs.map((tab, index) => (
              <Tab
                key={tab.value}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {tab.label}
                    <Badge badgeContent={tab.count} color="primary" />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {order.orderNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {order.customer.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {order.customer.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {order.customer.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      ${order.totalAmount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, order)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewOrder}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => updateOrderStatus(selectedOrder?._id || '', 'processing')}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Mark as Processing
        </MenuItem>
        <MenuItem onClick={() => updateOrderStatus(selectedOrder?._id || '', 'shipped')}>
          <LocalShipping fontSize="small" sx={{ mr: 1 }} />
          Mark as Shipped
        </MenuItem>
        <MenuItem onClick={() => updateOrderStatus(selectedOrder?._id || '', 'delivered')}>
          <CheckCircle fontSize="small" sx={{ mr: 1 }} />
          Mark as Delivered
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteOrder(selectedOrder?._id || '')}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Cancel Order
        </MenuItem>
      </Menu>

      {/* Order Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details - {selectedOrder?.orderNumber}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedOrder.customer.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedOrder.customer.email}
                </Typography>
                {selectedOrder.customer.phone && (
                  <Typography variant="body2">
                    <strong>Phone:</strong> {selectedOrder.customer.phone}
                  </Typography>
                )}
                {selectedOrder.customer.address && (
                  <Typography variant="body2" mt={1}>
                    <strong>Shipping Address:</strong><br />
                    {selectedOrder.customer.address}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order Information
                </Typography>
                <Typography variant="body2">
                  <strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {selectedOrder.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}
                </Typography>
                {selectedOrder.expectedDelivery && (
                  <Typography variant="body2">
                    <strong>Expected Delivery:</strong> {new Date(selectedOrder.expectedDelivery).toLocaleDateString()}
                  </Typography>
                )}
                {selectedOrder.notes && (
                  <Typography variant="body2" mt={1}>
                    <strong>Notes:</strong><br />
                    {selectedOrder.notes}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName || item.product}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            ${item.totalPrice.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
          <Button variant="contained">
            Edit Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;