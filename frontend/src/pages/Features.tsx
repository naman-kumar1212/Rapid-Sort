import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Inventory as InventoryIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  LocalShipping as LocalShippingIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  CloudSync as CloudSyncIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Category as CategoryIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const Features: React.FC = () => {
  const navigate = useNavigate();

  const featureCategories = [
    {
      title: 'Inventory Management',
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      features: [
        'Real-time stock level tracking across multiple warehouses',
        'Automatic low-stock alerts and reorder notifications',
        'SKU and barcode management with bulk operations',
        'Product categorization and custom attributes',
        'Batch and serial number tracking',
        'Stock transfer between locations',
        'Inventory valuation (FIFO, LIFO, Weighted Average)',
        'Dead stock and slow-moving inventory identification',
      ],
    },
    {
      title: 'Order Management',
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#10b981',
      features: [
        'Complete order lifecycle management',
        'Multi-channel order processing',
        'Order status tracking and updates',
        'Automated order fulfillment workflows',
        'Backorder management',
        'Return and refund processing',
        'Order history and audit trails',
        'Custom order statuses and workflows',
      ],
    },
    {
      title: 'Supplier Management',
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      features: [
        'Comprehensive supplier database',
        'Purchase order creation and tracking',
        'Supplier performance analytics',
        'Automated reordering based on stock levels',
        'Supplier contact and communication history',
        'Multiple suppliers per product',
        'Lead time tracking',
        'Supplier pricing and terms management',
      ],
    },
    {
      title: 'Customer Management',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#ec4899',
      features: [
        'Complete customer profiles and history',
        'Customer segmentation and tagging',
        'Purchase history and preferences',
        'Customer lifetime value tracking',
        'Credit limit management',
        'Customer communication logs',
        'Loyalty program integration',
        'Customer analytics and insights',
      ],
    },
    {
      title: 'Analytics & Reporting',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      color: '#8b5cf6',
      features: [
        'Real-time dashboard with key metrics',
        'Customizable reports and charts',
        'Revenue and profit analysis',
        'Inventory turnover reports',
        'Sales trends and forecasting',
        'Supplier performance reports',
        'Export to PDF, Excel, and CSV',
        'Scheduled report generation and email delivery',
      ],
    },
    {
      title: 'Security & Access Control',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      color: '#ef4444',
      features: [
        'Role-based access control (Admin, Manager, Employee)',
        'JWT authentication with secure token management',
        'bcrypt password hashing with salt',
        'HTTPS/TLS encryption for all communications',
        'AES-256-GCM encryption for sensitive data',
        'Zero-Trust security architecture',
        'Audit logs and activity tracking',
        'Two-factor authentication (2FA) support',
      ],
    },
    {
      title: 'Real-Time Notifications',
      icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
      color: '#06b6d4',
      features: [
        'WebSocket-powered instant updates',
        'Low stock alerts',
        'New order notifications',
        'Supplier delivery updates',
        'System event notifications',
        'Customizable notification preferences',
        'Email and in-app notifications',
        'Mobile push notifications (coming soon)',
      ],
    },
    {
      title: 'Performance & Scalability',
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      color: '#14b8a6',
      features: [
        'Multi-database architecture for optimal performance',
        'Redis caching for lightning-fast queries',
        'MongoDB for flexible document storage',
        'PostgreSQL for transactional data',
        'Neo4j for relationship mapping',
        'InfluxDB for time-series analytics',
        'Database sharding and replication',
        '99.9% uptime guarantee',
      ],
    },
  ];

  const integrations = [
    'RESTful API with comprehensive documentation',
    'Webhook support for real-time integrations',
    'CSV/Excel import and export',
    'Barcode scanner integration',
    'E-commerce platform connectors',
    'Accounting software integration',
    'Shipping carrier integration',
    'Payment gateway support',
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        {/* Hero Section */}
        <Paper elevation={3} sx={{ p: 6, mb: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h2" component="h1" fontWeight="bold" mb={3}>
            Powerful Features
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.95 }}>
            Everything you need to manage your inventory, orders, suppliers, and customers in one comprehensive platform
          </Typography>
        </Paper>

        {/* Feature Categories */}
        {featureCategories.map((category, index) => (
          <Paper key={index} elevation={3} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  bgcolor: category.color,
                  color: 'white',
                  p: 2,
                  borderRadius: 2,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {category.icon}
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {category.title}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {category.features.map((feature, featureIndex) => (
                <Grid item xs={12} md={6} key={featureIndex}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5, flexShrink: 0 }} />
                    <Typography variant="body1">{feature}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}

        {/* Integrations Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Integrations & API
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
            Rapid Sort seamlessly integrates with your existing tools and workflows. Our comprehensive API 
            allows you to build custom integrations and automate your business processes.
          </Typography>

          <Grid container spacing={2}>
            {integrations.map((integration, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircleIcon sx={{ color: 'primary.main', mr: 1, mt: 0.5, flexShrink: 0 }} />
                  <Typography variant="body1">{integration}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Technical Specifications */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Technical Specifications
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Database Architecture
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="MongoDB - Primary data store" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Redis - Caching layer" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="PostgreSQL - Transactional data" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Neo4j - Relationship mapping" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="InfluxDB - Time-series analytics" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Security Features
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary="JWT authentication" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary="bcrypt password hashing (12 rounds)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary="AES-256-GCM encryption" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary="HTTPS/TLS 1.2+" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary="Zero-Trust architecture" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Performance Metrics
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="99.9% uptime SLA" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="< 100ms average response time" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Real-time WebSocket updates" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Automatic scaling" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Daily automated backups" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Supported Platforms
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary="Web browsers (Chrome, Firefox, Safari, Edge)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary="Mobile responsive design" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary="Tablet optimized" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary="Progressive Web App (PWA)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary="Mobile apps (coming soon)" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* CTA Section */}
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Experience All Features Free for 14 Days
          </Typography>
          <Typography variant="h6" mb={4} sx={{ opacity: 0.9 }}>
            No credit card required. Full access to all features. Cancel anytime.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                px: 4,
                py: 1.5,
                backgroundColor: '#FFD700',
                color: '#333',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#FFC107',
                },
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: '#FFD700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              View Demo
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Features;
