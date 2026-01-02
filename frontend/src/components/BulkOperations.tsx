import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { productAPI } from '../services/api';
import { CreateProductData } from '../types/Product';

interface BulkProduct {
  id: number;
  name: string;
  price: string;
  quantity: string;
  category: string;
}

const BulkOperations: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Bulk Create State
  const [bulkProducts, setBulkProducts] = useState<BulkProduct[]>([
    { name: '', price: '', quantity: '', category: '', id: Date.now() }
  ]);

  // Bulk Delete State
  const [deleteIds, setDeleteIds] = useState<string>('');

  const addProductRow = (): void => {
    setBulkProducts(prev => [
      ...prev,
      { name: '', price: '', quantity: '', category: '', id: Date.now() }
    ]);
  };

  const removeProductRow = (id: number): void => {
    setBulkProducts(prev => prev.filter(product => product.id !== id));
  };

  const updateProduct = (id: number, field: keyof Omit<BulkProduct, 'id'>, value: string): void => {
    setBulkProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const validateBulkProducts = (): CreateProductData[] | false => {
    const validProducts = bulkProducts.filter(product =>
      product.name.trim() &&
      product.price &&
      !isNaN(Number(product.price)) &&
      parseFloat(product.price) >= 0
    );

    if (validProducts.length === 0) {
      setError('Please add at least one valid product with name and price');
      return false;
    }

    return validProducts.map(product => ({
      name: product.name.trim(),
      price: parseFloat(product.price),
      quantity: product.quantity ? parseInt(product.quantity) : 0,
      ...(product.category && { category: product.category.trim() })
    }));
  };

  const handleBulkCreate = async (): Promise<void> => {
    const validProducts = validateBulkProducts();
    if (!validProducts) return;

    setLoading(true);
    setError(null);

    try {
      const response = await productAPI.bulkCreateProducts(validProducts);
      setSuccess(`${response.data.data.length} products created successfully!`);

      // Reset form
      setBulkProducts([
        { name: '', price: '', quantity: '', category: '', id: Date.now() }
      ]);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (): Promise<void> => {
    if (!deleteIds.trim()) {
      setError('Please enter product IDs to delete');
      return;
    }

    const productIds = deleteIds
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (productIds.length === 0) {
      setError('Please enter valid product IDs');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productAPI.bulkDeleteProducts(productIds);
      setSuccess(`${response.data.deletedCount} products deleted successfully!`);
      setDeleteIds('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bulk Operations
      </Typography>

      {/* Error/Success Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Bulk Create Section */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            Bulk Create Products
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Add multiple products at once. Fill in the required fields for each product.
          </Typography>

          {bulkProducts.map((product, index) => (
            <Paper key={product.id} elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#fafafa' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="primary">
                  Product {index + 1}
                </Typography>
                {bulkProducts.length > 1 && (
                  <IconButton
                    onClick={() => removeProductRow(product.id)}
                    color="error"
                    size="small"
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: '2fr 1fr 1fr'
                  },
                  gap: 2,
                  mb: 2
                }}
              >
                <TextField
                  fullWidth
                  label="Product Name *"
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Price *"
                  type="number"
                  value={product.price}
                  onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={product.quantity}
                  onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                  inputProps={{ min: 0 }}
                  size="small"
                />
              </Box>
              <TextField
                fullWidth
                label="Category"
                value={product.category}
                onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                placeholder="e.g., Electronics"
                size="small"
              />
            </Paper>
          ))}

          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addProductRow}
            >
              Add Another Product
            </Button>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
              onClick={handleBulkCreate}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create All Products'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Bulk Delete Section */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="error">
            Bulk Delete Products
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Delete multiple products by entering their IDs separated by commas.
          </Typography>

          <TextField
            fullWidth
            label="Product IDs"
            value={deleteIds}
            onChange={(e) => setDeleteIds(e.target.value)}
            multiline
            rows={3}
            placeholder="Enter product IDs separated by commas (e.g., 64f1a2b3c4d5e6f7g8h9i0j1, 64f1a2b3c4d5e6f7g8h9i0j2)"
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            onClick={handleBulkDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Products'}
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card elevation={1} sx={{ mt: 4, backgroundColor: '#e3f2fd' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Instructions
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)'
              },
              gap: 2
            }}
          >
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Bulk Create:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Product name and price are required fields<br />
                • Quantity defaults to 0 if not specified<br />
                • Category is optional but recommended
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Bulk Delete:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Get product IDs from the product list screen<br />
                • Separate multiple IDs with commas<br />
                • This action cannot be undone
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BulkOperations;