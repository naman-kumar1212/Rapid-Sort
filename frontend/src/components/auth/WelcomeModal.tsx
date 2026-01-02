import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Celebration as CelebrationIcon,
} from '@mui/icons-material';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  userName: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onClose, userName }) => {
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
              p: 4,
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
            
            <CelebrationIcon sx={{ fontSize: 60, mb: 2, color: '#FFD700' }} />
            
            <Typography variant="h4" fontWeight="bold" mb={1}>
              Welcome, {userName}! 🎉
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              You're all set up and ready to manage your inventory like a pro!
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center">
                Here's what you can do now:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { icon: '📊', title: 'View Dashboard', desc: 'Get insights into your business performance' },
                  { icon: '📦', title: 'Manage Products', desc: 'Add, edit, and track your inventory' },
                  { icon: '🛒', title: 'Process Orders', desc: 'Handle customer orders efficiently' },
                  { icon: '📈', title: 'Analyze Reports', desc: 'Make data-driven business decisions' },
                ].map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#e9ecef',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        mr: 2,
                        backgroundColor: 'transparent',
                        fontSize: '1.5rem',
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.desc}
                      </Typography>
                    </Box>
                    <CheckCircleIcon sx={{ ml: 'auto', color: 'success.main' }} />
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label="💡 Pro Tip: Use the sidebar to navigate between different sections"
                sx={{
                  mb: 3,
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  fontWeight: 'medium',
                }}
              />
              
              <Button
                variant="contained"
                size="large"
                onClick={onClose}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                Let's Get Started! 🚀
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;