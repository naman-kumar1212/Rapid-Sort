import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowBack as ArrowBackIcon,
  Inventory as InventoryIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CloudDone as CloudDoneIcon,
} from '@mui/icons-material';

const About: React.FC = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      title: 'Innovation',
      description: 'Constantly evolving with cutting-edge technology to provide the best inventory management solutions.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Security First',
      description: 'Your data security is our top priority with enterprise-grade encryption and Zero-Trust architecture.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Customer Success',
      description: 'Dedicated to helping businesses succeed with exceptional support and continuous improvements.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Performance',
      description: 'Lightning-fast operations powered by multi-database architecture and intelligent caching.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '50M+', label: 'Products Tracked' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
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
            About Rapid Sort
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.95 }}>
            Empowering businesses worldwide with intelligent inventory management solutions
          </Typography>
        </Paper>

        {/* Mission Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            At Rapid Sort, our mission is to revolutionize inventory management for businesses of all sizes. 
            We believe that efficient inventory control shouldn't be complicated or expensive. That's why we've 
            built a powerful, intuitive platform that combines cutting-edge technology with user-friendly design.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            We're committed to helping businesses reduce costs, eliminate stock-outs, optimize operations, 
            and make data-driven decisions that drive growth. Our platform is built on the foundation of 
            innovation, security, and customer success.
          </Typography>
        </Paper>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <Typography variant="h3" fontWeight="bold" color="primary" mb={1}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Our Story */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Our Story
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            Rapid Sort was founded in 2023 by a team of software engineers and supply chain experts who 
            experienced firsthand the challenges of managing inventory with outdated systems. We saw businesses 
            struggling with spreadsheets, disconnected tools, and lack of real-time visibility.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            We set out to build something better—a modern, cloud-based platform that leverages the latest 
            technologies including React, TypeScript, Express.js, and a multi-database architecture. Today, 
            Rapid Sort serves thousands of businesses across retail, manufacturing, e-commerce, and logistics.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            Our platform has evolved from a simple inventory tracker to a comprehensive business intelligence 
            tool that helps companies optimize their entire supply chain, from supplier management to customer 
            fulfillment.
          </Typography>
        </Paper>

        {/* Core Values */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
            Our Core Values
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                        {value.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {value.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Technology Stack */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Technology Stack
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}>
            Rapid Sort is built with modern, enterprise-grade technologies to ensure reliability, 
            performance, and scalability:
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Frontend Technologies
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="React 18" color="primary" />
                  <Chip label="TypeScript" color="primary" />
                  <Chip label="Material-UI" color="primary" />
                  <Chip label="React Router" color="primary" />
                  <Chip label="Axios" color="primary" />
                  <Chip label="WebSocket Client" color="primary" />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Backend Technologies
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="Node.js" color="success" />
                  <Chip label="Express.js" color="success" />
                  <Chip label="MongoDB" color="success" />
                  <Chip label="Redis" color="success" />
                  <Chip label="PostgreSQL" color="success" />
                  <Chip label="WebSocket Server" color="success" />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Security & Authentication
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="JWT" color="error" />
                  <Chip label="bcrypt" color="error" />
                  <Chip label="HTTPS/TLS" color="error" />
                  <Chip label="AES-256-GCM" color="error" />
                  <Chip label="Zero-Trust" color="error" />
                  <Chip label="RBAC" color="error" />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Advanced Features
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="Neo4j Graph DB" color="warning" />
                  <Chip label="InfluxDB" color="warning" />
                  <Chip label="Real-time Analytics" color="warning" />
                  <Chip label="PDF Generation" color="warning" />
                  <Chip label="CSV Export" color="warning" />
                  <Chip label="RESTful API" color="warning" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Contact CTA */}
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" mb={4} sx={{ opacity: 0.9 }}>
            Join thousands of businesses using Rapid Sort to transform their inventory management
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
              Contact Sales
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
