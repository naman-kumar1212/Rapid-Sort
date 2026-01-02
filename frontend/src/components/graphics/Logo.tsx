/**
 * Logo Component
 * 
 * Animated SVG logo for Rapid Sort
 */
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface LogoProps {
  size?: number;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 40, animated = false }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={theme.palette.primary.main}
          strokeWidth="3"
          fill="none"
          style={{
            animation: animated ? `${rotate} 8s linear infinite` : 'none',
            transformOrigin: 'center',
          }}
          strokeDasharray="10 5"
        />

        {/* Inner circle */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill={theme.palette.primary.main}
          opacity="0.1"
        />

        {/* Arrow up (representing growth/sorting) */}
        <path
          d="M50 25 L50 65 M50 25 L40 35 M50 25 L60 35"
          stroke={theme.palette.primary.main}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bars (representing inventory) */}
        <rect
          x="35"
          y="55"
          width="8"
          height="20"
          fill={theme.palette.secondary.main}
          rx="2"
        />
        <rect
          x="46"
          y="50"
          width="8"
          height="25"
          fill={theme.palette.secondary.main}
          rx="2"
        />
        <rect
          x="57"
          y="45"
          width="8"
          height="30"
          fill={theme.palette.secondary.main}
          rx="2"
        />

        {/* Speed lines */}
        <path
          d="M20 30 L30 30 M15 40 L25 40 M20 50 L30 50"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </Box>
  );
};

export default Logo;