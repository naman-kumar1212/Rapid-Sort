import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  FileDownload,
  Assessment,
  TrendingUp,
  Inventory,
  People,
  Business,
  DateRange,
  Star,
} from '@mui/icons-material';
import { useReports } from '../hooks/useReports';
import { SalesReport, InventoryReport, CustomerReport, SupplierReport } from '../services/reportsApiFixed';
import { BarChart, PieChart } from '../components/charts';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentReport, setCurrentReport] = useState<any>(null);

  const {
    loading,
    error,
    getSalesReport,
    getInventoryReport,
    getCustomerReport,
    getSupplierReport,
    exportReport
  } = useReports();

  const reportTypes = [
    { value: 'sales', label: 'Sales Report', icon: <TrendingUp /> },
    { value: 'inventory', label: 'Inventory Report', icon: <Inventory /> },
    { value: 'customers', label: 'Customer Report', icon: <People /> },
    { value: 'suppliers', label: 'Supplier Report', icon: <Business /> },
  ];

  const dateRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const getFilters = () => {
    const filters: any = {};

    if (dateRange === 'custom' && startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    } else if (dateRange !== 'custom') {
      const days = parseInt(dateRange.replace('days', '').replace('year', '365'));
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      filters.startDate = startDate.toISOString().split('T')[0];
      filters.endDate = endDate.toISOString().split('T')[0];
    }

    return filters;
  };

  const generateReport = async () => {
    try {
      const filters = getFilters();
      let report;

      switch (reportType) {
        case 'sales':
          report = await getSalesReport(filters);
          break;
        case 'inventory':
          report = await getInventoryReport(filters);
          break;
        case 'customers':
          report = await getCustomerReport(filters);
          break;
        case 'suppliers':
          report = await getSupplierReport(filters);
          break;
        default:
          return;
      }

      setCurrentReport(report);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const filters = { ...getFilters(), format };
      await exportReport(reportType, filters);
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const renderSalesReport = (report: SalesReport) => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Sales
            </Typography>
            <Typography variant="h4" component="div">
              ${(report.totalSales || 0).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Orders
            </Typography>
            <Typography variant="h4" component="div">
              {report.totalOrders}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Average Order Value
            </Typography>
            <Typography variant="h4" component="div">
              ${(report.averageOrderValue || 0).toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Period
            </Typography>
            <Typography variant="h6" component="div">
              {report.period}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Top Products Section */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Star color="primary" />
              <Typography variant="h6">
                Top Performing Products
              </Typography>
            </Box>

            {report.topProducts && report.topProducts.length > 0 ? (
              <Grid container spacing={3}>
                {/* Top Products Chart */}
                <Grid item xs={12} md={6}>
                  <BarChart
                    data={(report.topProducts || []).slice(0, 8).map((product: any) => ({
                      name: (product.productName || 'Unknown Product').length > 15
                        ? (product.productName || 'Unknown Product').substring(0, 15) + '...'
                        : (product.productName || 'Unknown Product'),
                      quantity: product.quantitySold || 0,
                      revenue: product.revenue || 0
                    }))}
                    title="Top Products by Quantity Sold"
                    xKey="name"
                    yKey="quantity"
                    color="#10b981"
                    height={300}
                    formatValue={(value) => `${value} units`}
                  />
                </Grid>

                {/* Revenue Distribution */}
                <Grid item xs={12} md={6}>
                  <PieChart
                    data={(report.topProducts || []).slice(0, 6).map((product: any) => ({
                      name: (product.productName || 'Unknown Product').length > 20
                        ? (product.productName || 'Unknown Product').substring(0, 20) + '...'
                        : (product.productName || 'Unknown Product'),
                      value: product.revenue || 0
                    }))}
                    title="Revenue Distribution by Product"
                    dataKey="value"
                    nameKey="name"
                    height={300}
                    formatValue={(value) => `$${value.toLocaleString()}`}
                  />
                </Grid>

                {/* Detailed Table */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Detailed Product Performance
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Rank</TableCell>
                          <TableCell>Product Name</TableCell>
                          <TableCell align="right">Quantity Sold</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                          <TableCell align="right">Avg. Price</TableCell>
                          <TableCell align="right">Performance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(report.topProducts || []).map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Chip
                                label={`#${index + 1}`}
                                color={index < 3 ? 'primary' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{product.productName || 'Unknown Product'}</TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="bold">
                                {product.quantitySold || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="bold" color="success.main">
                                ${(product.revenue || 0).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              ${((product.revenue || 0) / (product.quantitySold || 1)).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={index < 3 ? 'Excellent' : index < 6 ? 'Good' : 'Average'}
                                color={index < 3 ? 'success' : index < 6 ? 'primary' : 'default'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="textSecondary">
                  No product sales data available for the selected period
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderInventoryReport = (report: InventoryReport) => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h4" component="div">
              {report.totalProducts}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Value
            </Typography>
            <Typography variant="h4" component="div">
              ${(report.totalValue || 0).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Low Stock Items
            </Typography>
            <Typography variant="h4" component="div" color="warning.main">
              {report.lowStockItems}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Out of Stock
            </Typography>
            <Typography variant="h4" component="div" color="error.main">
              {report.outOfStockItems}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Inventory by Category
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Product Count</TableCell>
                    <TableCell align="right">Total Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(report.categories || []).map((category, index) => (
                    <TableRow key={index}>
                      <TableCell>{category.categoryName || 'Unknown'}</TableCell>
                      <TableCell align="right">{category.productCount || 0}</TableCell>
                      <TableCell align="right">${(category.totalValue || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCustomerReport = (report: CustomerReport) => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Customers
            </Typography>
            <Typography variant="h4" component="div">
              {report.totalCustomers}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              New Customers
            </Typography>
            <Typography variant="h4" component="div" color="success.main">
              {report.newCustomers}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Repeat Customers
            </Typography>
            <Typography variant="h4" component="div" color="info.main">
              {report.repeatCustomers}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Customers
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Total Orders</TableCell>
                    <TableCell align="right">Total Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(report.topCustomers || []).map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell>{customer.customerName || 'Unknown Customer'}</TableCell>
                      <TableCell align="right">{customer.totalOrders || 0}</TableCell>
                      <TableCell align="right">${(customer.totalSpent || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSupplierReport = (report: SupplierReport) => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Suppliers
            </Typography>
            <Typography variant="h4" component="div">
              {report.totalSuppliers}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Suppliers
            </Typography>
            <Typography variant="h4" component="div" color="success.main">
              {report.activeSuppliers}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Supplier Performance
            </Typography>
            <Typography variant="h6" component="div">
              {(((report.activeSuppliers || 0) / (report.totalSuppliers || 1)) * 100).toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Suppliers
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Supplier</TableCell>
                    <TableCell align="right">Total Products</TableCell>
                    <TableCell align="right">Total Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(report.topSuppliers || []).map((supplier, index) => (
                    <TableRow key={index}>
                      <TableCell>{supplier.supplierName || 'Unknown Supplier'}</TableCell>
                      <TableCell align="right">{supplier.totalProducts || 0}</TableCell>
                      <TableCell align="right">${(supplier.totalValue || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderReport = () => {
    if (!currentReport) return null;

    switch (reportType) {
      case 'sales':
        return renderSalesReport(currentReport);
      case 'inventory':
        return renderInventoryReport(currentReport);
      case 'customers':
        return renderCustomerReport(currentReport);
      case 'suppliers':
        return renderSupplierReport(currentReport);
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Reports & Analytics
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Generate comprehensive reports and analyze your business performance
      </Typography>

      {/* Report Configuration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  {reportTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {type.icon}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Date Range"
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  {dateRanges.map((range) => (
                    <MenuItem key={range.value} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {dateRange === 'custom' && (
              <>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={dateRange === 'custom' ? 2 : 6}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Assessment />}
                  onClick={generateReport}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={20} /> : 'Generate Report'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Export Options */}
      {currentReport && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Export Options
              </Typography>
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<FileDownload />}
                  onClick={() => handleExport('csv')}
                  disabled={loading}
                >
                  Export CSV
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileDownload />}
                  onClick={() => handleExport('pdf')}
                  disabled={loading}
                >
                  Export PDF
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Report Content */}
      {currentReport && (
        <Box>
          <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              {reportTypes.find(t => t.value === reportType)?.label}
            </Typography>
            <Chip
              icon={<DateRange />}
              label={`Generated: ${new Date().toLocaleDateString()}`}
              variant="outlined"
            />
          </Box>
          {renderReport()}
        </Box>
      )}

      {/* Empty State */}
      {!currentReport && !loading && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Report Generated
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Select a report type and date range, then click "Generate Report" to view analytics
            </Typography>
            <Button
              variant="contained"
              startIcon={<Assessment />}
              onClick={generateReport}
              disabled={loading}
            >
              Generate Your First Report
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Reports;