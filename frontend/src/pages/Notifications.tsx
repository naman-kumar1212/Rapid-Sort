import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  Divider,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNotifications, Notification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const [tabValue, setTabValue] = useState(0);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    const iconProps = { fontSize: 'medium' as const };
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
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.action) {
      navigate(notification.action.path);
    }
  };

  const filterNotifications = (notifications: Notification[]) => {
    let filtered = notifications;

    // Filter by read/unread status
    if (tabValue === 1) {
      filtered = filtered.filter(n => !n.read);
    } else if (tabValue === 2) {
      filtered = filtered.filter(n => n.read);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    return filtered;
  };

  const filteredNotifications = filterNotifications(notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Notifications
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Stay updated with your Rapid Sort system
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              {notifications.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Notifications
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="error">
              {unreadCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Unread Notifications
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {unreadCount > 0 && (
          <Button
            variant="contained"
            startIcon={<MarkReadIcon />}
            onClick={markAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
        {notifications.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={clearAll}
          >
            Clear All
          </Button>
        )}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={typeFilter}
            label="Filter by Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`All (${notifications.length})`} />
            <Tab label={`Unread (${unreadCount})`} />
            <Tab label={`Read (${notifications.length - unreadCount})`} />
          </Tabs>
        </Box>

        {/* Notifications List */}
        <TabPanel value={tabValue} index={tabValue}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="info">
                {tabValue === 1 ? 'No unread notifications' : 
                 tabValue === 2 ? 'No read notifications' : 
                 'No notifications found'}
              </Alert>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      cursor: notification.action ? 'pointer' : 'default',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                      alignItems: 'flex-start',
                      py: 2,
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'transparent', width: 40, height: 40 }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Typography variant="h6" fontWeight="medium">
                            {notification.title}
                          </Typography>
                          {!notification.read && (
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body1" color="textPrimary" sx={{ mb: 1 }}>
                            {notification.message}
                          </Typography>
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="textSecondary">
                              {formatTime(notification.timestamp)}
                            </Typography>
                            <Chip
                              label={notification.type.toUpperCase()}
                              size="small"
                              color={getTypeColor(notification.type)}
                              variant="outlined"
                            />
                          </Box>
                          {notification.action && (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ mt: 1 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification);
                              }}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </Box>
                      }
                    />
                    <Box display="flex" flexDirection="column" gap={1} ml={2}>
                      {!notification.read && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          title="Mark as read"
                        >
                          <MarkReadIcon />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        title="Remove"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>
      </Card>
    </Box>
  );
};

export default Notifications;