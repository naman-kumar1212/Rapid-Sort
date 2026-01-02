import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Alert,
    CircularProgress,
    Fade,
    Slide,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import './AuthModal.css';
import {
    Close as CloseIcon,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'manager', // Default role
        department: 'management', // Default department for manager
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();

    // Debug: Log errors whenever they change
    useEffect(() => {
        console.log('Errors state updated:', errors);
    }, [errors]);

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value,
        }));
        // Clear errors when user starts typing
        if (errors[field] || errors.submit) {
            setErrors(prev => ({
                ...prev,
                [field]: '',
                submit: '' // Clear submit error when user types
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.role) {
            newErrors.role = 'Please select your role';
        }

        if (mode === 'signup') {
            if (!formData.firstName) {
                newErrors.firstName = 'First name is required';
            }
            if (!formData.lastName) {
                newErrors.lastName = 'Last name is required';
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
            if (!formData.role) {
                newErrors.role = 'Role is required';
            }
            if (!formData.department) {
                newErrors.department = 'Department is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            if (mode === 'login') {
                await login({ 
                    email: formData.email, 
                    password: formData.password,
                    role: formData.role 
                });
            } else {
                await register({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    department: formData.department,
                });
            }
            onClose();
        } catch (error: any) {
            // Stop loading immediately on error
            setLoading(false);
            
            // Extract error message from backend response
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            
            setErrors({ submit: errorMessage });
            return; // Exit early to prevent finally block from running
        }
        
        // Only set loading to false on success (though modal will close)
        setLoading(false);
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setErrors({});
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'manager',
            department: 'management',
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden',
                },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ position: 'relative' }}>
                    {/* Header */}
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            p: 3,
                            textAlign: 'center',
                            position: 'relative',
                        }}
                    >
                        <IconButton
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: 'white',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <Typography variant="h4" fontWeight="bold" mb={1}>
                            {mode === 'login' ? 'Welcome Back!' : 'Join Us Today!'}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            {mode === 'login'
                                ? 'Sign in to access your inventory dashboard'
                                : 'Create your account to get started'
                            }
                        </Typography>
                        {mode === 'login' && (
                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                                Select your role to access the appropriate features
                            </Typography>
                        )}
                    </Box>

                    {/* Form */}
                    <Box sx={{ p: 4 }}>
                        {errors.submit && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mb: 3,
                                    '& .MuiAlert-message': {
                                        width: '100%',
                                        fontSize: '0.95rem'
                                    }
                                }}
                                onClose={() => setErrors({ ...errors, submit: '' })}
                            >
                                {errors.submit}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {mode === 'signup' && (
                                    <>
                                        <Fade in={mode === 'signup'}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                value={formData.firstName}
                                                onChange={handleInputChange('firstName')}
                                                error={!!errors.firstName}
                                                helperText={errors.firstName}
                                                variant="outlined"
                                            />
                                        </Fade>
                                        <Fade in={mode === 'signup'}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                value={formData.lastName}
                                                onChange={handleInputChange('lastName')}
                                                error={!!errors.lastName}
                                                helperText={errors.lastName}
                                                variant="outlined"
                                            />
                                        </Fade>
                                    </>
                                )}

                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    variant="outlined"
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        ),
                                    }}
                                />

                                {mode === 'login' && (
                                    <FormControl fullWidth variant="outlined" error={!!errors.role}>
                                        <InputLabel>Login as</InputLabel>
                                        <Select
                                            value={formData.role}
                                            onChange={(e) => {
                                                setFormData(prev => ({ ...prev, role: e.target.value }));
                                                if (errors.role) {
                                                    setErrors(prev => ({ ...prev, role: '' }));
                                                }
                                            }}
                                            label="Login as"
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: '#ffffff',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                                        mt: 1,
                                                        '& .MuiMenuItem-root': {
                                                            py: 1.5,
                                                            px: 2,
                                                            minHeight: 'auto',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(102, 126, 234, 0.08)',
                                                            },
                                                            '&.Mui-selected': {
                                                                bgcolor: 'rgba(102, 126, 234, 0.12)',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(102, 126, 234, 0.16)',
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="employee">
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                                                        Employee
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#666666', display: 'block', lineHeight: 1.4 }}>
                                                        Access to assigned tasks and basic features
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="manager">
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                                                        Manager (Recommended)
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#666666', display: 'block', lineHeight: 1.4 }}>
                                                        Full inventory and team management access
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="admin">
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                                                        Admin
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#666666', display: 'block', lineHeight: 1.4 }}>
                                                        Complete system administration access
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        </Select>
                                        {errors.role && (
                                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                                {errors.role}
                                            </Typography>
                                        )}
                                    </FormControl>
                                )}

                                {mode === 'signup' && (
                                    <Slide direction="up" in={mode === 'signup'}>
                                        <TextField
                                            fullWidth
                                            label="Confirm Password"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange('confirmPassword')}
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword}
                                            variant="outlined"
                                        />
                                    </Slide>
                                )}

                                {mode === 'signup' && (
                                    <>
                                        <Fade in={mode === 'signup'}>
                                            <FormControl fullWidth variant="outlined" error={!!errors.role}>
                                                <InputLabel>Role</InputLabel>
                                                <Select
                                                    value={formData.role}
                                                    onChange={(e) => {
                                                        const newRole = e.target.value;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            role: newRole,
                                                            // Auto-set appropriate department based on role
                                                            department: newRole === 'admin' ? 'management' :
                                                                      newRole === 'manager' ? 'management' :
                                                                      'inventory'
                                                        }));
                                                        if (errors.role) {
                                                            setErrors(prev => ({ ...prev, role: '' }));
                                                        }
                                                    }}
                                                    label="Role"
                                                    MenuProps={{
                                                        PaperProps: {
                                                            sx: {
                                                                bgcolor: '#ffffff',
                                                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                                                mt: 1,
                                                                '& .MuiMenuItem-root': {
                                                                    py: 1.5,
                                                                    px: 2,
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                                                                    },
                                                                    '&.Mui-selected': {
                                                                        bgcolor: 'rgba(102, 126, 234, 0.12)',
                                                                        '&:hover': {
                                                                            bgcolor: 'rgba(102, 126, 234, 0.16)',
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="employee">
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                                                                Employee
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#666666', display: 'block', lineHeight: 1.4 }}>
                                                                Basic access to assigned tasks
                                                            </Typography>
                                                        </Box>
                                                    </MenuItem>
                                                    <MenuItem value="manager">
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                                                                Manager (Default)
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#666666', display: 'block', lineHeight: 1.4 }}>
                                                                Manage team and operations
                                                            </Typography>
                                                        </Box>
                                                    </MenuItem>
                                                    <MenuItem value="admin">
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                                                                Admin
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#666666', display: 'block', lineHeight: 1.4 }}>
                                                                Full system access and control
                                                            </Typography>
                                                        </Box>
                                                    </MenuItem>
                                                </Select>
                                                {errors.role && (
                                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                                        {errors.role}
                                                    </Typography>
                                                )}
                                                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, ml: 1.5 }}>
                                                    Manager role is selected by default for new accounts
                                                </Typography>
                                            </FormControl>
                                        </Fade>
                                        <Fade in={mode === 'signup'}>
                                            <FormControl fullWidth variant="outlined" error={!!errors.department}>
                                                <InputLabel>Department</InputLabel>
                                                <Select
                                                    value={formData.department}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({ ...prev, department: e.target.value }));
                                                        if (errors.department) {
                                                            setErrors(prev => ({ ...prev, department: '' }));
                                                        }
                                                    }}
                                                    label="Department"
                                                    MenuProps={{
                                                        PaperProps: {
                                                            sx: {
                                                                bgcolor: '#ffffff',
                                                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                                                mt: 1,
                                                                '& .MuiMenuItem-root': {
                                                                    py: 1.5,
                                                                    px: 2,
                                                                    color: '#1a1a1a',
                                                                    fontWeight: 500,
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                                                                    },
                                                                    '&.Mui-selected': {
                                                                        bgcolor: 'rgba(102, 126, 234, 0.12)',
                                                                        '&:hover': {
                                                                            bgcolor: 'rgba(102, 126, 234, 0.16)',
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="management">Management</MenuItem>
                                                    <MenuItem value="inventory">Inventory</MenuItem>
                                                    <MenuItem value="sales">Sales</MenuItem>
                                                    <MenuItem value="purchasing">Purchasing</MenuItem>
                                                    <MenuItem value="warehouse">Warehouse</MenuItem>
                                                </Select>
                                                {errors.department && (
                                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                                        {errors.department}
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        </Fade>
                                    </>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                        },
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        mode === 'login' ? 'Sign In' : 'Create Account'
                                    )}
                                </Button>
                            </Box>
                        </form>





                        {/* Switch Mode */}
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                {mode === 'login'
                                    ? "Don't have an account? "
                                    : "Already have an account? "
                                }
                                <Button
                                    variant="text"
                                    onClick={switchMode}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        p: 0,
                                        minWidth: 'auto',
                                    }}
                                >
                                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;