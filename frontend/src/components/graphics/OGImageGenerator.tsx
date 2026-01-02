/**
 * Open Graph Image Generator Component
 * 
 * Generates proper OG images for social media sharing with inventory focus
 */
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  Inventory2 as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

interface OGImageProps {
  title?: string;
  subtitle?: string;
  features?: string[];
}

const OGImageGenerator: React.FC<OGImageProps> = ({
  title = "Smart Inventory Management",
  subtitle = "Real-time tracking, AI analytics, and zero-trust security for modern businesses",
  features = ["⚡ Real-time Updates", "🔒 Zero-Trust Security", "📊 AI Analytics", "☁️ Cloud Sync"]
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 1200,
        height: 630,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6366f1 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 80px',
        boxSizing: 'border-box',
        color: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Enhanced Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 15% 15%, rgba(255,255,255,0.15) 0%, transparent 40%),
            radial-gradient(circle at 85% 85%, rgba(255,255,255,0.1) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 60%)
          `,
        }}
      />

      {/* Animated Grid Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.6,
        }}
      />

      {/* Floating Inventory Icons */}
      <Box
        sx={{
          position: 'absolute',
          top: '8%',
          right: '12%',
          opacity: 0.2,
        }}
      >
        <InventoryIcon sx={{ fontSize: '48px', color: 'white' }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '65%',
          right: '8%',
          opacity: 0.25,
        }}
      >
        <TrendingUpIcon sx={{ fontSize: '40px', color: '#FFD700' }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          right: '22%',
          opacity: 0.2,
        }}
      >
        <AnalyticsIcon sx={{ fontSize: '36px', color: 'white' }} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, zIndex: 2 }}>
        {/* Enhanced Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
              {/* Enhanced inventory icon */}
              <path
                d="M50 15 L50 75 M50 15 L35 30 M50 15 L65 30"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Inventory bars with gradient effect */}
              <rect x="30" y="60" width="10" height="25" fill="#FFD700" rx="3" />
              <rect x="45" y="50" width="10" height="35" fill="#FFD700" rx="3" />
              <rect x="60" y="45" width="10" height="40" fill="#FFD700" rx="3" />
              {/* Data points */}
              <circle cx="35" cy="55" r="3" fill="white" opacity="0.8" />
              <circle cx="50" cy="45" r="3" fill="white" opacity="0.8" />
              <circle cx="65" cy="40" r="3" fill="white" opacity="0.8" />
            </svg>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: '36px',
                fontWeight: 900,
                color: '#FFD700',
                textShadow: '0 3px 6px rgba(0,0,0,0.4)',
                letterSpacing: '-0.5px',
              }}
            >
              Rapid Sort
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Inventory Intelligence
            </Typography>
          </Box>
        </Box>

        {/* Enhanced Title */}
        <Typography
          sx={{
            fontSize: '64px',
            fontWeight: 900,
            lineHeight: 1.1,
            mb: 3,
            textShadow: '0 4px 12px rgba(0,0,0,0.4)',
            background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px',
          }}
        >
          {title}
        </Typography>

        {/* Enhanced Subtitle */}
        <Typography
          sx={{
            fontSize: '26px',
            fontWeight: 400,
            opacity: 0.95,
            mb: 4,
            lineHeight: 1.4,
            maxWidth: '580px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {subtitle}
        </Typography>

        {/* Enhanced Features */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '16px',
                padding: '14px 24px',
                fontSize: '18px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              {feature}
            </Box>
          ))}
        </Box>

        {/* Trust Indicators */}
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon sx={{ fontSize: '24px', color: '#FFD700' }} />
            <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
              Enterprise Security
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon sx={{ fontSize: '24px', color: '#FFD700' }} />
            <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
              Real-time Performance
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Enhanced Visual */}
      <Box
        sx={{
          flex: '0 0 420px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Main Dashboard Preview */}
        <Box
          sx={{
            width: 380,
            height: 280,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
            borderRadius: 3,
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden',
            transform: 'perspective(1200px) rotateY(-12deg) rotateX(3deg)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {/* Dashboard Header */}
          <Box
            sx={{
              height: 70,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
              }}
            />
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.7)',
              }}
            />
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.5)',
              }}
            />
            <Typography
              sx={{
                ml: 2,
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              Inventory Dashboard
            </Typography>
          </Box>

          {/* Dashboard Content */}
          <Box sx={{ padding: 3, background: 'white' }}>
            {/* Stats Row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  height: 20,
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  borderRadius: 1,
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  height: 20,
                  background: 'linear-gradient(90deg, #10b981, #059669)',
                  borderRadius: 1,
                }}
              />
            </Box>
            
            {/* Chart Representation */}
            <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: 60 }}>
              <Box sx={{ width: 20, height: '40%', background: '#e2e8f0', borderRadius: 0.5 }} />
              <Box sx={{ width: 20, height: '70%', background: '#cbd5e1', borderRadius: 0.5 }} />
              <Box sx={{ width: 20, height: '90%', background: '#94a3b8', borderRadius: 0.5 }} />
              <Box sx={{ width: 20, height: '60%', background: '#64748b', borderRadius: 0.5 }} />
              <Box sx={{ width: 20, height: '80%', background: '#475569', borderRadius: 0.5 }} />
            </Box>

            {/* Data Rows */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ height: 12, background: '#f1f5f9', borderRadius: 0.5, mb: 1, width: '85%' }} />
              <Box sx={{ height: 12, background: '#e2e8f0', borderRadius: 0.5, mb: 1, width: '70%' }} />
              <Box sx={{ height: 12, background: '#cbd5e1', borderRadius: 0.5, width: '90%' }} />
            </Box>
          </Box>
        </Box>

        {/* Floating Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.3))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(16,185,129,0.3)',
          }}
        >
          <TrendingUpIcon sx={{ fontSize: '28px', color: '#10b981' }} />
        </Box>
      </Box>

      {/* Enhanced Stats */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 50,
          left: 80,
          display: 'flex',
          gap: 6,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '40px',
              fontWeight: 900,
              color: '#FFD700',
              textShadow: '0 3px 6px rgba(0,0,0,0.4)',
              lineHeight: 1,
            }}
          >
            10K+
          </Typography>
          <Typography sx={{ fontSize: '16px', opacity: 0.9, mt: 0.5, fontWeight: 600 }}>
            Products Managed
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '40px',
              fontWeight: 900,
              color: '#FFD700',
              textShadow: '0 3px 6px rgba(0,0,0,0.4)',
              lineHeight: 1,
            }}
          >
            500+
          </Typography>
          <Typography sx={{ fontSize: '16px', opacity: 0.9, mt: 0.5, fontWeight: 600 }}>
            Active Users
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '40px',
              fontWeight: 900,
              color: '#FFD700',
              textShadow: '0 3px 6px rgba(0,0,0,0.4)',
              lineHeight: 1,
            }}
          >
            99.9%
          </Typography>
          <Typography sx={{ fontSize: '16px', opacity: 0.9, mt: 0.5, fontWeight: 600 }}>
            Uptime
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OGImageGenerator;