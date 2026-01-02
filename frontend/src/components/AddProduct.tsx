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
  Stack,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { CreateProductData } from '../types/Product';

interface FormData {
  name: string;
  price: string;
  quantity: string;
  category: string;
  description: string;
  supplier: string;
}

interface FormErrors {
  [key: string]: string | null;
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    quantity: '',
    category: '',
    description: '',
    supplier: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || isNaN(Number(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Valid price is required';
    }

    if (formData.quantity && (isNaN(Number(formData.quantity)) || parseInt(formData.quantity) < 0)) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productData: CreateProductData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
        ...(formData.category && { category: formData.category.trim() }),
        ...(formData.description && { description: formData.description.trim() }),
        ...(formData.supplier && { supplier: formData.supplier.trim() }),
      };

      await productAPI.createProduct(productData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        quantity: '',
        category: '',
        description: '',
        supplier: '',
      });

      // Show success message and redirect after delay
      setTimeout(() => {
        navigate('/products');
      }, 2000);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    navigate('/products');
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Add New Product
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Create a new product entry for your inventory
        </Typography>
      </Box>

      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Form Fields Grid */}
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)'
                  },
                  gap: 3
                }}
              >
                {/* Product Name */}
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />

                {/* Price */}
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  error={!!errors.price}
                  helperText={errors.price}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                />

                {/* Quantity */}
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  inputProps={{ min: 0 }}
                />

                {/* Category */}
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Electronics, Clothing"
                />

                {/* Supplier */}
                <TextField
                  fullWidth
                  label="Supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Supplier name"
                />
              </Box>

              {/* Description - Full Width */}
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Product description..."
              />

              {/* Error Alert */}
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert severity="success">
                  Product created successfully! Redirecting to products list...
                </Alert>
              )}

              {/* Action Buttons */}
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<CancelIcon />}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Product'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddProduct;