/**
 * Feature Showcase Component
 * 
 * Visual showcase of key features with improved UI/UX design
 */
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  Container,
  Chip,
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Insights as InsightsIcon,
  CloudSync as CloudSyncIcon,
  Notifications as NotificationsIcon,
  Analytics as AnalyticsIcon,
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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
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
    icon: <SpeedIcon sx={{ fontSize: 50 }} />,
    title: 'Lightning Fast',
    description: 'Real-time WebSocket updates ensure instant synchronization across all devices with sub-50ms response times',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    badge: 'Real-time',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 50 }} />,
    title: 'Zero-Trust Security',
    description: 'Enterprise-grade security with continuous verification, threat detection, and end-to-end encryption',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    badge: 'Enterprise',
  },
  {
    icon: <InsightsIcon sx={{ fontSize: 50 }} />,
    title: 'AI-Powered Analytics',
    description: 'Machine learning insights and predictive analytics to optimize inventory levels and forecast demand',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    badge: 'AI-Powered',
  },
  {
    icon: <CloudSyncIcon sx={{ fontSize: 50 }} />,
    title: 'Cloud Sync',
    description: 'Seamless multi-cloud synchronization with 99.9% uptime and automatic failover protection',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    badge: '99.9% Uptime',
  },
  {
    icon: <NotificationsIcon sx={{ fontSize: 50 }} />,
    title: 'Smart Notifications',
    description: 'Intelligent alerts for low stock, new orders, and anomaly detection with customizable thresholds',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    badge: 'Smart',
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 50 }} />,
    title: 'Advanced Reports',
    description: 'Interactive dashboards with drill-down capabilities, custom KPIs, and automated report generation',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    badge: 'Interactive',
  },
];

const FeatureShowcase: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 12,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
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
          backgroundSize: '40px 40px',
          opacity: 0.5,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box textAlign="center" mb={8}>
          <Chip
            label="🚀 Powerful Features"
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
            Everything You Need
          </Typography>
          
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              animation: `${fadeInUp} 1s ease-out 0.2s both`,
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Comprehensive tools to manage your inventory efficiently and scale your business
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
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
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: `0 20px 40px ${feature.color}20`,
                    '& .feature-icon': {
                      animation: `${pulse} 1s ease-in-out infinite, ${glow} 2s ease-in-out infinite`,
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

                {/* Icon Container */}
                <Box
                  className="feature-icon"
                  sx={{
                    position: 'absolute',
                    top: -40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: feature.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: `0 8px 32px ${feature.color}40`,
                    transition: 'all 0.3s ease',
                    border: '4px solid',
                    borderColor: theme.palette.background.paper,
                  }}
                >
                  {feature.icon}
                </Box>

                <CardContent sx={{ pt: 6, pb: 4, px: 3, textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      color: feature.color,
                      mb: 2,
                      fontSize: '1.5rem',
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
                
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `${feature.color}10`,
                    opacity: 0.5,
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <Box textAlign="center" mt={8}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Ready to transform your inventory management?
          </Typography>
          <Chip
            label="Start Free Trial →"
            clickable
            sx={{
              px: 4,
              py: 1,
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
        </Box>
      </Container>
    </Box>
  );
};

export default FeatureShowcase;