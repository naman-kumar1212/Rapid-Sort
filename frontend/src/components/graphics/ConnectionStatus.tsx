/**
 * Connection Status Component
 * 
 * Visual indicator for WebSocket connection status
 */
import React from 'react';
import { Box, Chip, Tooltip, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';
import {
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon,
  SyncProblem as ReconnectingIcon,
} from '@mui/icons-material';
import { useWebSocketContext } from '../../contexts/WebSocketContext';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const ConnectionStatus: React.FC = () => {
  const { isConnected } = useWebSocketContext();
  const theme = useTheme();

  const getStatusConfig = () => {
    if (isConnected) {
      return {
        label: 'Live',
        icon: <ConnectedIcon />,
        color: 'success' as const,
        tooltip: 'Real-time updates active',
      };
    }
    return {
      label: 'Offline',
      icon: <DisconnectedIcon />,
      color: 'error' as const,
      tooltip: 'Reconnecting to server...',
    };
  };

  const config = getStatusConfig();

  return (
    <Tooltip title={config.tooltip} arrow>
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Chip
          icon={config.icon}
          label={config.label}
          color={config.color}
          size="small"
          sx={{
            fontWeight: 'bold',
            animation: !isConnected ? `${pulse} 2s ease-in-out infinite` : 'none',
          }}
        />
        
        {/* Ripple effect for connected state */}
        {isConnected && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                border: `2px solid ${theme.palette.success.main}`,
                animation: `${ripple} 2s ease-out infinite`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                border: `2px solid ${theme.palette.success.main}`,
                animation: `${ripple} 2s ease-out infinite 1s`,
              }}
            />
          </>
        )}
      </Box>
    </Tooltip>
  );
};

export default ConnectionStatus;