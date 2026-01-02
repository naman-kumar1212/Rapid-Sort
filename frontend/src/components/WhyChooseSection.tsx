/**
 * Why Choose Section Component
 * 
 * Enhanced version with improved UI/UX design
 */
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
  Storage as DatabaseIcon,
  Speed as RealtimeIcon,
  Security as SecurityIcon,
  TrendingUp as ScalableIcon,
  Assessment as ReportingIcon,
  Hub as IntegrationIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.6);
  }
`;

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
  color: string;
  gradient: string;
  badge?: string;
}

const features: Feature[] = [
  {
    icon: <DatabaseIcon sx={{ fontSize: 40 }} />,
    title: 'MongoDB Database',
    description: 'Flexible NoSQL database with powerful querying capabilities, automatic scaling, and built-in replication for enterprise-grade reliability.',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    badge: 'NoSQL',
  },
  {
    icon: <RealtimeIcon sx={{ fontSize: 40 }} />,
    title: 'Real-time Updates',
    description: 'WebSocket-powered instant synchronization across all devices with sub-50ms latency for immediate inventory visibility.',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    badge: 'Live',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Enterprise-Grade Security',
    description: 'Zero-trust architecture with JWT authentication, bcrypt encryption, and continuous threat monitoring for maximum protection.',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    badge: 'Zero-Trust',
  },
  {
    icon: <ScalableIcon sx={{ fontSize: 40 }} />,
    title: 'Scalable & Reliable',
    description: 'Cloud-native architecture with auto-scaling capabilities, 99.9% uptime SLA, and global CDN for optimal performance.',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    badge: '99.9% SLA',
  },
  {
    icon: <ReportingIcon sx={{ fontSize: 40 }} />,
    title: 'Comprehensive Reporting',
    description: 'Advanced analytics with customizable dashboards, automated insights, and export capabilities for data-driven decisions.',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    badge: 'AI-Powered',
  },
  {
    icon: <IntegrationIcon sx={{ fontSize: 40 }} />,
    title: 'Easy Integration',
    description: 'RESTful APIs, webhook support, and pre-built connectors for seamless integration with existing ERP and e-commerce platforms.',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    badge: 'API-First',
  },
];

const WhyChooseSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 12,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.6,
        }}
      />

      {/* Floating Elements */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${features[i]?.color}20, ${features[i]?.color}10)`,
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 2) * 60}%`,
            animation: `${float} ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            opacity: 0.3,
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Box textAlign="center" mb={8}>
          <Chip
            label="🚀 Why Choose Us"
            sx={{
              mb: 3,
              px: 3,
              py: 1,
              fontSize: '1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              '& .MuiChip-label': {
                px: 2,
              },
            }}
          />

          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: `${fadeInUp} 1s ease-out`,
              mb: 3,
            }}
          >
            Why Choose Rapid Sort?
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              animation: `${fadeInUp} 1s ease-out 0.2s both`,
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Discover the advantages that make us the preferred choice for modern inventory management
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              md={6}
              key={index}
              sx={{
                animation: `${fadeInUp} 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'visible',
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                  borderRadius: 3,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 20px 40px ${feature.color}20`,
                    '& .feature-icon': {
                      animation: `${glow} 2s ease-in-out infinite`,
                      transform: 'scale(1.1)',
                    },
                    '& .feature-badge': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                {/* Badge */}
                {feature.badge && (
                  <Chip
                    className="feature-badge"
                    label={feature.badge}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: 16,
                      background: feature.gradient,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      transition: 'transform 0.3s ease',
                      zIndex: 2,
                    }}
                  />
                )}

                <CardContent sx={{ p: 4 }}>
                  {/* Icon and Title Row */}
                  <Box display="flex" alignItems="flex-start" gap={3} mb={3}>
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: 2,
                        background: feature.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: `0 8px 24px ${feature.color}30`,
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                      }}
                    >
                      {feature.icon}
                    </Box>

                    <Box flex={1}>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                          color: theme.palette.text.primary,
                          mb: 2,
                          fontSize: '1.4rem',
                        }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                          fontSize: '1rem',
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Check Icon */}
                  <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <CheckIcon sx={{ color: feature.color, fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: feature.color,
                        fontWeight: 600,
                      }}
                    >
                      Enterprise Ready
                    </Typography>
                  </Box>
                </CardContent>

                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: feature.gradient,
                    borderRadius: '0 0 12px 12px',
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA Section */}
        <Box textAlign="center" mt={10}>
          <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={3}>
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} sx={{ color: '#FFD700', fontSize: 24 }} />
            ))}
            <Typography variant="body1" fontWeight="bold" ml={2}>
              Rated 4.9/5 by 1,200+ businesses
            </Typography>
          </Box>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Join thousands of businesses already using Rapid Sort
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Chip
              label="Start Free Trial →"
              clickable
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            />
            <Chip
              label="Schedule Demo"
              variant="outlined"
              clickable
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}10`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WhyChooseSection;