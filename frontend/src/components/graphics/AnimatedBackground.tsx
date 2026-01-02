/**
 * Animated Background Component
 * 
 * Creates a dynamic animated background with floating elements
 */
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
`;

const AnimatedBackground: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      }}
    >
      {/* Floating circles */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              theme.palette.mode === 'dark'
                ? 'rgba(99, 102, 241, 0.1)'
                : 'rgba(255, 255, 255, 0.1)'
            } 0%, transparent 70%)`,
            animation: `${float} ${8 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Grid pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: theme.palette.mode === 'dark'
            ? 'linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)'
            : 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: `${pulse} 4s ease-in-out infinite`,
        }}
      />
    </Box>
  );
};

export default AnimatedBackground;