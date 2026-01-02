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
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Rating,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Business,
  Email,
  Phone,
  Language,
} from '@mui/icons-material';
import { useSuppliers } from '../hooks/useSuppliers';
import { Supplier, CreateSupplierData } from '../services/suppliersApi';

const Suppliers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState<CreateSupplierData>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    website: '',
    taxId: '',
    paymentTerms: '',
    rating: 0,
    notes: ''
  });

  const getFilters = () => {
    return statusFilter === 'all' ? {} : { status: statusFilter };
  };

  const { suppliers, loading, error, createSupplier, updateSupplier, deleteSupplier, refetch } = useSuppliers(getFilters());

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, supplier: Supplier) => {
    setAnchorEl(event.currentTarget);
    setSelectedSupplier(supplier);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSupplier(null);
  };

  const handleViewSupplier = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleCreateSupplier = async () => {
    try {
      await createSupplier(supplierForm);
      setCreateDialogOpen(false);
      setSupplierForm({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        website: '',
        taxId: '',
        paymentTerms: '',
        rating: 0,
        notes: ''
      });
    } catch (error) {
      console.error('Failed to create supplier:', error);
    }
  };

  const updateSupplierStatus = async (supplierId: string, newStatus: Supplier['status']) => {
    try {
      await updateSupplier(supplierId, { status: newStatus });
      handleMenuClose();
    } catch (error) {
      console.error('Failed to update supplier status:', error);
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    try {
      await deleteSupplier(supplierId);
      handleMenuClose();
    } catch (error) {
      console.error('Failed to delete supplier:', error);
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
            Suppliers
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your supplier relationships and contacts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Supplier
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              placeholder="Search suppliers..."
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
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
            >
              More Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 40, height: 40 }}>
                        <Business />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {supplier.name}
                        </Typography>
                        {supplier.website && (
                          <Typography variant="caption" color="textSecondary">
                            {supplier.website}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {supplier.contactPerson}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="caption">
                          {supplier.email}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="caption">
                          {supplier.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {supplier.address.city}, {supplier.address.state}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {supplier.address.country}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Rating
                      value={supplier.rating || 0}
                      readOnly
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={supplier.status}
                      color={getStatusColor(supplier.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, supplier)}
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
        <MenuItem onClick={handleViewSupplier}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => updateSupplierStatus(selectedSupplier?._id || '', 'active')}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Mark as Active
        </MenuItem>
        <MenuItem onClick={() => updateSupplierStatus(selectedSupplier?._id || '', 'inactive')}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Mark as Inactive
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteSupplier(selectedSupplier?._id || '')}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Supplier
        </MenuItem>
      </Menu>

      {/* Supplier Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Supplier Details - {selectedSupplier?.name}
        </DialogTitle>
        <DialogContent>
          {selectedSupplier && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Company Information
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedSupplier.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Contact Person:</strong> {selectedSupplier.contactPerson}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedSupplier.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {selectedSupplier.phone}
                </Typography>
                {selectedSupplier.website && (
                  <Typography variant="body2">
                    <strong>Website:</strong> {selectedSupplier.website}
                  </Typography>
                )}
                {selectedSupplier.taxId && (
                  <Typography variant="body2">
                    <strong>Tax ID:</strong> {selectedSupplier.taxId}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Business Details
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {selectedSupplier.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Payment Terms:</strong> {selectedSupplier.paymentTerms}
                </Typography>
                <Typography variant="body2">
                  <strong>Rating:</strong>
                </Typography>
                <Rating
                  value={selectedSupplier.rating || 0}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" mt={1}>
                  <strong>Address:</strong><br />
                  {selectedSupplier.address.street}<br />
                  {selectedSupplier.address.city}, {selectedSupplier.address.state} {selectedSupplier.address.zipCode}<br />
                  {selectedSupplier.address.country}
                </Typography>
              </Grid>
              {selectedSupplier.notes && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2">
                    {selectedSupplier.notes}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
          <Button variant="contained">
            Edit Supplier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Supplier Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Supplier</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person"
                value={supplierForm.contactPerson}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, contactPerson: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={supplierForm.email}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={supplierForm.phone}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={supplierForm.address.street}
                onChange={(e) => setSupplierForm(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, street: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={supplierForm.address.city}
                onChange={(e) => setSupplierForm(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, city: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={supplierForm.address.state}
                onChange={(e) => setSupplierForm(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, state: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Zip Code"
                value={supplierForm.address.zipCode}
                onChange={(e) => setSupplierForm(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, zipCode: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={supplierForm.address.country}
                onChange={(e) => setSupplierForm(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, country: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Terms"
                value={supplierForm.paymentTerms}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website (optional)"
                value={supplierForm.website}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, website: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (optional)"
                multiline
                rows={3}
                value={supplierForm.notes}
                onChange={(e) => setSupplierForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateSupplier} variant="contained">
            Add Supplier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Suppliers;