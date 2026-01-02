/**
 * Statistics Visualization Component
 * 
 * Animated statistics display with counters
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  useTheme,
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Speed as SpeedIcon,
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

const countUp = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

interface Stat {
  icon: React.ReactElement;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: <InventoryIcon sx={{ fontSize: 50 }} />,
    value: 10000,
    suffix: '+',
    label: 'Products Managed',
    color: '#6366f1',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 50 }} />,
    value: 500,
    suffix: '+',
    label: 'Active Users',
    color: '#10b981',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 50 }} />,
    value: 99,
    suffix: '%',
    label: 'Uptime',
    color: '#f59e0b',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 50 }} />,
    value: 50,
    suffix: 'ms',
    label: 'Response Time',
    color: '#06b6d4',
  },
];

const AnimatedCounter: React.FC<{ end: number; duration?: number }> = ({
  end,
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}</>;
};

const StatsVisualization: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 8,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.3,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: 'white',
              animation: `${fadeInUp} 1s ease-out`,
            }}
          >
            Trusted by Businesses Worldwide
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              animation: `${fadeInUp} 1s ease-out 0.2s both`,
            }}
          >
            Real-time statistics that matter
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              sx={{
                animation: `${fadeInUp} 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: 'rgba(255,255,255,0.15)',
                    boxShadow: `0 8px 32px ${stat.color}40`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${stat.color}40, ${stat.color}60)`,
                    color: 'white',
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>

                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    color: 'white',
                    mb: 1,
                    animation: `${countUp} 0.5s ease-out ${index * 0.1 + 0.5}s both`,
                  }}
                >
                  <AnimatedCounter end={stat.value} />
                  {stat.suffix}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsVisualization;