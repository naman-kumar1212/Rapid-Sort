import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Switch,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  Person,
  Security,
  Palette,
  Storage,
  Edit,
  Save,
  PhotoCamera,
  CloudDownload,
  DarkMode,
  LightMode,
  Brightness4,
  Schedule,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(false);
  
  // Theme and preferences state
  const theme = useTheme();
  const { mode, actualMode, setMode } = useCustomTheme();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  const [timezone, setTimezone] = useState(() => {
    return localStorage.getItem('timezone') || 'UTC+5:30';
  });
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'INR';
  });
  const [dateFormat, setDateFormat] = useState(() => {
    return localStorage.getItem('dateFormat') || 'MM/DD/YYYY';
  });
  const [autoBackup, setAutoBackup] = useState(() => {
    const saved = localStorage.getItem('autoBackup');
    return saved ? JSON.parse(saved) : true;
  });
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Hooks
  const { user, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Enforce INR as the application currency
  useEffect(() => {
    if (currency !== 'INR') {
      setCurrency('INR');
      localStorage.setItem('currency', 'INR');
    }
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleProfileFormChange = (field: string, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Simulate API call - in real app, this would update the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditDialogOpen(false);
      showSnackbar('Profile updated successfully');
    } catch (error) {
      showSnackbar('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return;
    }

    try {
      setLoading(true);
      // Simulate API call - in real app, this would call authApi.changePassword
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSnackbar('Password changed successfully');
    } catch (error) {
      showSnackbar('Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'auto') => {
    setMode(newMode);
    showSnackbar(`${newMode === 'auto' ? 'Auto' : newMode === 'dark' ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    localStorage.setItem('timezone', value);
    showSnackbar('Timezone updated');
  };

  const handleCurrencyChange = (_value: string) => {
    // Currency is enforced to INR across the app.
    const enforced = 'INR';
    setCurrency(enforced);
    localStorage.setItem('currency', enforced);
    showSnackbar('Currency is fixed to INR');
  };

  const handleDateFormatChange = (value: string) => {
    setDateFormat(value);
    localStorage.setItem('dateFormat', value);
    showSnackbar('Date format updated');
  };

  const handleAutoBackupChange = (value: boolean) => {
    setAutoBackup(value);
    localStorage.setItem('autoBackup', JSON.stringify(value));
    showSnackbar(`Auto backup ${value ? 'enabled' : 'disabled'}`);
  };

  const handleExportData = async (format: 'json' | 'csv') => {
    try {
      setLoading(true);
      
      // Simulate data export
      const data = {
        user: user,
        preferences: {
          themeMode: mode,
          actualTheme: actualMode,
          language,
          timezone,
          currency,
          dateFormat,
          autoBackup
        },
        exportDate: new Date().toISOString()
      };

      const blob = format === 'json' 
        ? new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        : new Blob([convertToCSV(data)], { type: 'text/csv' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSnackbar(`Data exported as ${format.toUpperCase()}`);
    } catch (error) {
      showSnackbar('Failed to export data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const convertToCSV = (data: any) => {
    const headers = ['Field', 'Value'];
    const rows = [
      ['First Name', data.user?.firstName || ''],
      ['Last Name', data.user?.lastName || ''],
      ['Email', data.user?.email || ''],
      ['Role', data.user?.role || ''],
      ['Department', data.user?.department || ''],
      ['Theme Mode', data.preferences.themeMode],
      ['Current Theme', data.preferences.actualTheme],
      ['Language', data.preferences.language],
      ['Timezone', data.preferences.timezone],
      ['Currency', data.preferences.currency],
      ['Date Format', data.preferences.dateFormat],
      ['Auto Backup', data.preferences.autoBackup ? 'Yes' : 'No'],
      ['Export Date', data.exportDate]
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Settings
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Manage your account settings and preferences
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<Person />} label="Profile" />
            <Tab icon={<Security />} label="Security" />
            <Tab icon={<Palette />} label="Appearance" />
            <Tab icon={<Storage />} label="Data & Export" />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar 
                  sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}
                  src={user?.avatar ? `http://localhost:5000${user.avatar}` : undefined}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<PhotoCamera />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={user?.firstName || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={user?.lastName || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={user?.email || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={user?.phone || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={user?.role || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={user?.department || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" gap={2}>
                    <Button 
                      variant="contained" 
                      startIcon={<Edit />}
                      onClick={() => setEditDialogOpen(true)}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Password
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    Keep your account secure with a strong password
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => setPasswordDialogOpen(true)}
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Security
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    Account created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    color="error"
                    onClick={logout}
                  >
                    Logout All Sessions
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Appearance Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                    {actualMode === 'dark' ? <DarkMode /> : <LightMode />}
                    Theme Preferences
                  </Typography>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Theme Mode</InputLabel>
                    <Select
                      value={mode}
                      label="Theme Mode"
                      onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'auto')}
                    >
                      <MenuItem value="light">
                        <Box display="flex" alignItems="center" gap={1}>
                          <LightMode />
                          Light Mode
                        </Box>
                      </MenuItem>
                      <MenuItem value="dark">
                        <Box display="flex" alignItems="center" gap={1}>
                          <DarkMode />
                          Dark Mode
                        </Box>
                      </MenuItem>
                      <MenuItem value="auto">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Brightness4 />
                          Auto (System)
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Current theme: {actualMode === 'dark' ? 'Dark' : 'Light'}
                    {mode === 'auto' && ' (Auto-detected)'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                    <Schedule />
                    Regional Settings
                  </Typography>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={timezone}
                      label="Timezone"
                      onChange={(e) => handleTimezoneChange(e.target.value)}
                    >
                      <MenuItem value="UTC+5:30">🇮🇳 Indian Standard Time (UTC+5:30)</MenuItem>
                      <MenuItem value="UTC-8">🌊 Pacific Time (UTC-8)</MenuItem>
                      <MenuItem value="UTC-5">🗽 Eastern Time (UTC-5)</MenuItem>
                      <MenuItem value="UTC+0">🇬🇧 GMT (UTC+0)</MenuItem>
                      <MenuItem value="UTC+1">🇪🇺 Central European Time (UTC+1)</MenuItem>
                      <MenuItem value="UTC+8">🇸🇬 Singapore Time (UTC+8)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={currency}
                      label="Currency"
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      startAdornment={<AttachMoney sx={{ mr: 1, color: 'action.active' }} />}
                      disabled
                    >
                      <MenuItem value="INR">🇮🇳 Indian Rupee (₹ INR)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Date Format</InputLabel>
                    <Select
                      value={dateFormat}
                      label="Date Format"
                      onChange={(e) => handleDateFormatChange(e.target.value)}
                      startAdornment={<CalendarToday sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (US)</MenuItem>
                      <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</MenuItem>
                      <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Current Settings Preview:</strong><br />
                  Theme: {mode === 'auto' ? `Auto (${actualMode})` : mode === 'dark' ? 'Dark Mode' : 'Light Mode'} • 
                  Timezone: {timezone} • 
                  Currency: ₹ {currency} • 
                  Date: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: dateFormat.includes('MM/DD') ? '2-digit' : 'numeric',
                    day: '2-digit'
                  })}
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Data & Export Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                    <Storage />
                    Data Backup
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Storage />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Automatic Backup" 
                        secondary="Backup your data daily to prevent loss"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={autoBackup}
                          onChange={(e) => handleAutoBackupChange(e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Last backup: {autoBackup ? 'Today at 3:00 AM' : 'Never'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                    <CloudDownload />
                    Data Export
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    Export your profile and preferences data
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={loading ? <CircularProgress size={16} /> : <CloudDownload />}
                      onClick={() => handleExportData('csv')}
                      disabled={loading}
                    >
                      Export as CSV
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={loading ? <CircularProgress size={16} /> : <CloudDownload />}
                      onClick={() => handleExportData('json')}
                      disabled={loading}
                    >
                      Export as JSON
                    </Button>
                  </Box>
                  <Typography variant="caption" color="textSecondary" mt={1} display="block">
                    Includes: Profile info, preferences, and settings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Data Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="primary">
                          {user ? '1' : '0'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          User Profile
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="primary">
                          5
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Preferences
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="primary">
                          {actualMode === 'dark' ? '🌙' : '☀️'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Current Theme
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="primary">
                          {new Date().toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Last Updated
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={profileForm.firstName}
                onChange={(e) => handleProfileFormChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={profileForm.lastName}
                onChange={(e) => handleProfileFormChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profileForm.email}
                onChange={(e) => handleProfileFormChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={profileForm.phone}
                onChange={(e) => handleProfileFormChange('phone', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveProfile} 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handlePasswordChange} 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;