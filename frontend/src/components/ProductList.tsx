import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  InputAdornment,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Checkbox,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  GetApp as ExportIcon,
  MoreVert as MoreVertIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { Product, StockStatus } from '../types/Product';

interface DeleteDialogState {
  open: boolean;
  product: Product | null;
}

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ open: false, product: null });
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const ITEMS_PER_PAGE = 15;

  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        ...(searchQuery && { name: searchQuery }),
      };
      
      const response = await productAPI.getProducts(params);
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.total);
    } catch (error: any) {
      let errorMessage = 'Failed to fetch products';
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000';
      } else if (error.response?.status === 404) {
        errorMessage = 'Products API endpoint not found';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        console.error('Fetch products error:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleDeleteClick = (product: Product): void => {
    setDeleteDialog({ open: true, product });
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteDialog.product) return;

    try {
      await productAPI.deleteProduct(deleteDialog.product._id);
      setDeleteDialog({ open: false, product: null });
      fetchProducts(); // Refresh the list
    } catch (error: any) {
      setError('Failed to delete product');
      if (process.env.NODE_ENV === 'development') {
        console.error('Delete error:', error);
      }
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteDialog({ open: false, product: null });
  };

  const getStockStatus = (quantity: number): StockStatus => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' };
    if (quantity <= 10) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number): void => {
    setPage(newPage);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      setSelectedProducts(products.map(product => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string): void => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkDelete = async (): Promise<void> => {
    if (selectedProducts.length === 0) return;
    
    try {
      // Implement bulk delete API call
      console.log('Bulk deleting:', selectedProducts);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      setError('Failed to delete selected products');
    }
  };

  // Get unique categories from actual products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Inventory
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {totalProducts} Products
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ExportIcon />}>
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-product')}
          >
            Add Product
          </Button>
        </Stack>
      </Box>

      {/* Stock Status Bar - Will show real data when available */}
      {products.length > 0 && (
        <Card elevation={1} sx={{ mb: 3, bgcolor: 'background.paper' }}>
          <CardContent sx={{ py: 2 }}>
            <Box display="flex" alignItems="center" gap={4}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box width={12} height={12} bgcolor="success.main" borderRadius="50%" />
                <Typography variant="body2">In Stock: <strong>{products.filter(p => p.quantity > 10).length}</strong></Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box width={12} height={12} bgcolor="warning.main" borderRadius="50%" />
                <Typography variant="body2">Low Stock: <strong>{products.filter(p => p.quantity > 0 && p.quantity <= 10).length}</strong></Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box width={12} height={12} bgcolor="error.main" borderRadius="50%" />
                <Typography variant="body2">Out of Stock: <strong>{products.filter(p => p.quantity === 0).length}</strong></Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Search products, suppliers, orders..."
              value={searchQuery}
              onChange={handleSearch}
              size="small"
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                {statuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Tooltip title="Grid View">
                <IconButton 
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Table View">
                <IconButton 
                  onClick={() => setViewMode('table')}
                  color={viewMode === 'table' ? 'primary' : 'default'}
                >
                  <ListViewIcon />
                </IconButton>
              </Tooltip>
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Bulk Actions Toolbar */}
      {selectedProducts.length > 0 && (
        <Card elevation={1} sx={{ mb: 2, bgcolor: 'primary.light' }}>
          <Toolbar>
            <Typography variant="subtitle1" sx={{ flex: '1 1 100%' }}>
              {selectedProducts.length} selected
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </Toolbar>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Products Content */}
      {products.length > 0 ? (
        <>
          {viewMode === 'table' ? (
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                        checked={products.length > 0 && selectedProducts.length === products.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell align="right">Incoming</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.quantity);
                    const isSelected = selectedProducts.includes(product._id);
                    
                    return (
                      <TableRow 
                        key={product._id} 
                        hover
                        selected={isSelected}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectProduct(product._id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar 
                              sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}
                              variant="rounded"
                            >
                              {product.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="medium">
                                {product.name}
                              </Typography>
                              {product.supplier && (
                                <Typography variant="caption" color="textSecondary">
                                  {product.supplier}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {product.category && (
                            <Chip 
                              label={product.category} 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            SKU{product._id.slice(-6).toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            0
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {product.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={stockStatus.label}
                            color={stockStatus.color}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" fontWeight="medium">
                            ${product.price.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/edit-product/${product._id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(product)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 3
              }}
            >
              {products.map((product) => {
                const stockStatus = getStockStatus(product.quantity);
                return (
                  <Card key={product._id} elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Avatar 
                          sx={{ width: 48, height: 48, bgcolor: 'primary.light' }}
                          variant="rounded"
                        >
                          {product.name.charAt(0)}
                        </Avatar>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(product)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      <Typography variant="h6" component="div" gutterBottom>
                        {product.name}
                      </Typography>

                      <Typography variant="h5" color="primary" gutterBottom>
                        ${product.price.toFixed(2)}
                      </Typography>

                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body2" color="textSecondary">
                          Stock: {product.quantity}
                        </Typography>
                        <Chip
                          label={stockStatus.label}
                          color={stockStatus.color}
                          size="small"
                        />
                      </Box>

                      {product.category && (
                        <Chip
                          label={product.category}
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      )}

                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/edit-product/${product._id}`)}
                        sx={{ mt: 'auto' }}
                      >
                        Edit Product
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}

          {/* Pagination */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
            <Typography variant="body2" color="textSecondary">
              Result 1-{Math.min(ITEMS_PER_PAGE, products.length)} of {totalProducts}
            </Typography>
            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            )}
          </Box>
        </>
      ) : (
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {searchQuery ? 'No products found matching your search' : 'No products available'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-product')}
            sx={{ mt: 2 }}
          >
            Add First Product
          </Button>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.product?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading overlay for pagination */}
      {loading && products.length > 0 && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgcolor="rgba(255,255,255,0.7)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={1000}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ProductList;