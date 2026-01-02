import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  Badge,
  InputBase,
  alpha,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Store as StoreIcon,
  Assessment as ReportsIcon,
  People as CustomersIcon,
  LocalShipping as SuppliersIcon,
  ShoppingCart as OrdersIcon,
  TrendingUp as GrowthIcon,
  AttachMoney as RevenueIcon,
  Add as AddIcon,
  SwapHoriz as BulkIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Brightness4 as AutoModeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import NotificationDropdown from './NotificationDropdown';
import RealTimeNotifications from './RealTimeNotifications';
import ConnectionStatus from './graphics/ConnectionStatus';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactElement;
  section?: string;
}

const drawerWidth = 280;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { mode, toggleTheme } = useCustomTheme();

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon />, section: 'MAIN MENU' },
    { label: 'Products', path: '/products', icon: <InventoryIcon />, section: 'INVENTORY' },
    { label: 'Add Product', path: '/add-product', icon: <AddIcon /> },
    { label: 'Bulk Operations', path: '/bulk-operations', icon: <BulkIcon /> },
    { label: 'Orders', path: '/orders', icon: <OrdersIcon />, section: 'SALES & ORDERS' },
    { label: 'Customers', path: '/customers', icon: <CustomersIcon /> },
    { label: 'Suppliers', path: '/suppliers', icon: <SuppliersIcon />, section: 'SUPPLIERS' },
    { label: 'Reports', path: '/reports', icon: <ReportsIcon />, section: 'ANALYTICS' },
    { label: 'Revenue', path: '/revenue', icon: <RevenueIcon /> },
    { label: 'Growth', path: '/growth', icon: <GrowthIcon /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon />, section: 'SYSTEM' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/settings');
    handleUserMenuClose();
  };

  const SearchBox = () => (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        maxWidth: 400,
      }}
    >
      <Box
        sx={{
          padding: theme.spacing(0, 2),
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SearchIcon />
      </Box>
      <InputBase
        placeholder="Search product, supplier, order"
        sx={{
          color: 'inherit',
          width: '100%',
          '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
          },
        }}
      />
    </Box>
  );

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          <StoreIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Rapid Sort
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const showSection = item.section && (index === 0 || menuItems[index - 1].section !== item.section);

          return (
            <React.Fragment key={item.path}>
              {showSection && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'block',
                    color: 'text.secondary',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {item.section}
                </Typography>
              )}
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'white' : 'text.secondary',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>

      <Divider />

      {/* User Profile */}
      <Box sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{ width: 40, height: 40 }}
            src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle2" fontWeight="medium">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user?.role} • {user?.department}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <SearchBox />

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
              title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <ConnectionStatus />
            <RealTimeNotifications />
            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{ p: 0.5 }}
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Notification Dropdown */}
      <NotificationDropdown
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
      />

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
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
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile & Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;