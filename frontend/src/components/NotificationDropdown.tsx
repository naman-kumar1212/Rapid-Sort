import React from 'react';
import {
  Menu,
  MenuItem,
  Box,
  Typography,
  Avatar,
  Divider,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNotifications, Notification } from '../contexts/NotificationContext';

interface NotificationDropdownProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  anchorEl,
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();

  const getNotificationIcon = (type: Notification['type']) => {
    const iconProps = { fontSize: 'small' as const };
    switch (type) {
      case 'success':
        return <CheckCircleIcon {...iconProps} sx={{ color: 'success.main' }} />;
      case 'warning':
        return <WarningIcon {...iconProps} sx={{ color: 'warning.main' }} />;
      case 'error':
        return <ErrorIcon {...iconProps} sx={{ color: 'error.main' }} />;
      default:
        return <InfoIcon {...iconProps} sx={{ color: 'info.main' }} />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.action) {
      navigate(notification.action.path);
      onClose();
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeNotification(id);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          maxHeight: 500,
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
          <Box display="flex" gap={1}>
            {notifications.some(n => !n.read) && (
              <Button
                size="small"
                startIcon={<MarkReadIcon />}
                onClick={markAllAsRead}
                sx={{ minWidth: 'auto' }}
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                size="small"
                color="error"
                onClick={clearAll}
                sx={{ minWidth: 'auto' }}
              >
                Clear all
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            No notifications
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                button
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  backgroundColor: notification.read ? 'transparent' : 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  },
                  alignItems: 'flex-start',
                  py: 1.5,
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent', width: 32, height: 32 }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption" color="textSecondary">
                          {formatTime(notification.timestamp)}
                        </Typography>
                        <Chip
                          label={notification.type}
                          size="small"
                          color={getTypeColor(notification.type)}
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                      {notification.action && (
                        <Button
                          size="small"
                          variant="text"
                          sx={{ mt: 0.5, p: 0, minWidth: 'auto', fontSize: '0.75rem' }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    {!notification.read && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMarkAsRead(e, notification.id)}
                        title="Mark as read"
                      >
                        <MarkReadIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => handleRemove(e, notification.id)}
                      title="Remove"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Footer */}
      {notifications.length > 0 && (
        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Button
            size="small"
            onClick={() => {
              navigate('/notifications');
              onClose();
            }}
          >
            View All Notifications
          </Button>
        </Box>
      )}
    </Menu>
  );
};

export default NotificationDropdown;