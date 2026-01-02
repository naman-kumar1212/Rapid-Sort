/**
 * Hero Graphics Component
 * 
 * Cohesive animated graphics that blend with the landing page design
 */
import React, { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';
import {
  Inventory2 as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  CloudSync as CloudSyncIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

// Subtle, cohesive animations
const gentleFloat = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const smoothRotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const subtlePulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
`;

const orbitAnimation = keyframes`
  from {
    transform: rotate(0deg) translateX(120px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(120px) rotate(-360deg);
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroGraphics: React.FC = () => {
  const theme = useTheme();
  const [activeIcon, setActiveIcon] = useState(0);

  // Core inventory features that rotate
  const coreFeatures = [
    { icon: InventoryIcon, color: '#FFD700' },
    { icon: TrendingUpIcon, color: '#4CAF50' },
    { icon: AssessmentIcon, color: '#2196F3' },
    { icon: CloudSyncIcon, color: '#FF9800' },
  ];

  // Orbiting feature icons
  const orbitingFeatures = [
    { Icon: SpeedIcon, color: '#00BCD4', delay: 0 },
    { Icon: SecurityIcon, color: '#9C27B0', delay: 0.25 },
    { Icon: NotificationsIcon, color: '#F44336', delay: 0.5 },
    { Icon: AnalyticsIcon, color: '#4CAF50', delay: 0.75 },
  ];

  // Rotate main icon every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % coreFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [coreFeatures.length]);

  const currentFeature = coreFeatures[activeIcon];
  const CurrentIcon = currentFeature.icon;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background elements */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'rgba(255, 215, 0, 0.4)',
            left: `${20 + i * 15}%`,
            top: `${25 + (i % 2) * 30}%`,
            animation: `${gentleFloat} ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* Main central icon */}
      <Box
        sx={{
          position: 'relative',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: `${subtlePulse} 4s ease-in-out infinite`,
          zIndex: 5,
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '120%',
            height: '120%',
            borderRadius: '50%',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            animation: `${smoothRotate} 20s linear infinite`,
            zIndex: -1,
          },
        }}
      >
        <CurrentIcon 
          sx={{ 
            fontSize: 70, 
            color: currentFeature.color,
            filter: `drop-shadow(0 4px 8px ${currentFeature.color}40)`,
            transition: 'all 0.5s ease',
            animation: `${fadeInUp} 0.8s ease-out`,
          }} 
        />
      </Box>

      {/* Orbiting feature icons */}
      {orbitingFeatures.map(({ Icon, color, delay }, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: `${orbitAnimation} ${25 + index * 3}s linear infinite`,
            animationDelay: `${delay * 25}s`,
            zIndex: 3,
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.3s ease',
            },
          }}
        >
          <Icon 
            sx={{ 
              fontSize: 28, 
              color: color,
              filter: `drop-shadow(0 2px 4px ${color}30)`,
            }} 
          />
        </Box>
      ))}

      {/* Connecting orbit ring */}
      <Box
        sx={{
          position: 'absolute',
          width: 240,
          height: 240,
          borderRadius: '50%',
          border: '1px dashed rgba(255, 215, 0, 0.2)',
          animation: `${smoothRotate} 30s linear infinite reverse`,
          zIndex: 1,
        }}
      />

      {/* Data flow dots */}
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#FFD700',
            opacity: 0.6,
            animation: `${orbitAnimation} ${15 + i * 2}s linear infinite`,
            animationDelay: `${i * 5}s`,
            zIndex: 2,
          }}
        />
      ))}

      {/* Subtle connecting lines */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Subtle connection lines */}
        {orbitingFeatures.map((_, index) => {
          const angle = (index * 90) * (Math.PI / 180);
          const x1 = 200;
          const y1 = 200;
          const x2 = 200 + Math.cos(angle) * 120;
          const y2 = 200 + Math.sin(angle) * 120;
          
          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              strokeDasharray="4,8"
              opacity="0.5"
            />
          );
        })}
      </svg>

      {/* Decorative elements that match the page theme */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'rgba(255, 215, 0, 0.2)',
          animation: `${gentleFloat} 6s ease-in-out infinite`,
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: 15,
          height: 15,
          borderRadius: '50%',
          background: 'rgba(255, 215, 0, 0.3)',
          animation: `${gentleFloat} 8s ease-in-out infinite`,
          animationDelay: '2s',
        }}
      />

      {/* Geometric accent shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '12px solid rgba(255, 215, 0, 0.2)',
          animation: `${gentleFloat} 7s ease-in-out infinite`,
          animationDelay: '1s',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: 12,
          height: 12,
          background: 'rgba(255, 215, 0, 0.25)',
          transform: 'rotate(45deg)',
          animation: `${gentleFloat} 5s ease-in-out infinite`,
          animationDelay: '3s',
        }}
      />
    </Box>
  );
};

export default HeroGraphics;