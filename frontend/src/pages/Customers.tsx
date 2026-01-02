import React, { useState, useEffect } from 'react';
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
  Button,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  Add,
  Email,
  Phone,
  ShoppingBag,
  Refresh,
} from '@mui/icons-material';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for now - in a real app, this would fetch from API
  useEffect(() => {
    setCustomers([
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-1001',
        status: 'active',
        totalOrders: 5,
        totalSpent: 1250.00,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-1002',
        status: 'active',
        totalOrders: 3,
        totalSpent: 890.50,
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@email.com',
        phone: '+1-555-1003',
        status: 'active',
        totalOrders: 8,
        totalSpent: 2100.75,
        createdAt: new Date().toISOString()
      }
    ]);
  }, []);
  
  const refreshCustomers = () => {
    console.log('Refreshing customers...');
  };

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Customers
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Manage your customer database and relationships
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Customers
              </Typography>
              <Typography variant="h4" component="div">
                {customers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Customers
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {customers.filter(c => c.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" component="div">
                ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Order Value
              </Typography>
              <Typography variant="h4" component="div">
                ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 
                   customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
            <TextField
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refreshCustomers}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
              >
                Add Customer
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Customer List ({filteredCustomers.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Orders</TableCell>
                  <TableCell align="right">Total Spent</TableCell>
                  <TableCell align="right">Avg. Order</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {customer.firstName} {customer.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{customer.email}</Typography>
                        </Box>
                        {customer.phone && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Phone fontSize="small" color="action" />
                            <Typography variant="body2">{customer.phone}</Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status}
                        color={getStatusColor(customer.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                        <ShoppingBag fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight="bold">
                          {customer.totalOrders}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        ${customer.totalSpent.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        ${(customer.totalSpent / customer.totalOrders).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredCustomers.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="textSecondary">
                {searchTerm ? 'No customers found matching your search.' : 'No customers available.'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Customers;