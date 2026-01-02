import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  mode: ThemeMode;
  actualMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const getActualMode = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'auto') {
    return getSystemTheme();
  }
  return mode;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'light';
  });

  const [actualMode, setActualMode] = useState<'light' | 'dark'>(() => getActualMode(mode));

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
    setActualMode(getActualMode(newMode));
  };

  const toggleTheme = () => {
    const newMode = actualMode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        setActualMode(getSystemTheme());
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode]);

  const theme = createTheme({
    palette: {
      mode: actualMode,
      primary: {
        main: actualMode === 'dark' ? '#6366f1' : '#6366f1',
        light: actualMode === 'dark' ? '#a5b4fc' : '#a5b4fc',
        dark: actualMode === 'dark' ? '#4338ca' : '#4338ca',
      },
      secondary: {
        main: actualMode === 'dark' ? '#ec4899' : '#ec4899',
        light: actualMode === 'dark' ? '#f9a8d4' : '#f9a8d4',
        dark: actualMode === 'dark' ? '#be185d' : '#be185d',
      },
      background: {
        default: actualMode === 'dark' ? '#0f0f0f' : '#f8fafc',
        paper: actualMode === 'dark' ? '#1a1a1a' : '#ffffff',
      },
      text: {
        primary: actualMode === 'dark' ? '#f8fafc' : '#1f2937',
        secondary: actualMode === 'dark' ? '#a1a1aa' : '#6b7280',
      },
      divider: actualMode === 'dark' ? '#404040' : '#e5e7eb',
      success: {
        main: actualMode === 'dark' ? '#22c55e' : '#10b981',
        light: actualMode === 'dark' ? '#86efac' : '#6ee7b7',
        dark: actualMode === 'dark' ? '#15803d' : '#047857',
      },
      warning: {
        main: actualMode === 'dark' ? '#eab308' : '#f59e0b',
        light: actualMode === 'dark' ? '#fde047' : '#fbbf24',
        dark: actualMode === 'dark' ? '#a16207' : '#d97706',
      },
      error: {
        main: actualMode === 'dark' ? '#ef4444' : '#ef4444',
        light: actualMode === 'dark' ? '#fca5a5' : '#f87171',
        dark: actualMode === 'dark' ? '#dc2626' : '#dc2626',
      },
      info: {
        main: actualMode === 'dark' ? '#3b82f6' : '#3b82f6',
        light: actualMode === 'dark' ? '#93c5fd' : '#93c5fd',
        dark: actualMode === 'dark' ? '#1d4ed8' : '#1d4ed8',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        fontSize: '2rem',
        color: actualMode === 'dark' ? '#f8fafc' : '#1f2937',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.5rem',
        color: actualMode === 'dark' ? '#f8fafc' : '#1f2937',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.25rem',
        color: actualMode === 'dark' ? '#f8fafc' : '#1f2937',
      },
      subtitle1: {
        fontWeight: 500,
        color: actualMode === 'dark' ? '#e4e4e7' : '#374151',
      },
      subtitle2: {
        fontWeight: 500,
        color: actualMode === 'dark' ? '#e4e4e7' : '#374151',
      },
      body1: {
        fontSize: '0.95rem',
        color: actualMode === 'dark' ? '#d4d4d8' : '#374151',
      },
      body2: {
        fontSize: '0.875rem',
        color: actualMode === 'dark' ? '#a1a1aa' : '#6b7280',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: actualMode === 'dark' ? '#0f0f0f' : '#f8fafc',
            color: actualMode === 'dark' ? '#f8fafc' : '#1f2937',
          },
          '*': {
            '--scrollbar-track': actualMode === 'dark' ? '#262626' : '#f1f1f1',
            '--scrollbar-thumb': actualMode === 'dark' ? '#404040' : '#c1c1c1',
            '--scrollbar-thumb-hover': actualMode === 'dark' ? '#525252' : '#a8a8a8',
          },
          '::-webkit-scrollbar': {
            width: '8px',
          },
          '::-webkit-scrollbar-track': {
            background: actualMode === 'dark' ? '#262626' : '#f1f1f1',
          },
          '::-webkit-scrollbar-thumb': {
            background: actualMode === 'dark' ? '#404040' : '#c1c1c1',
            borderRadius: '4px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: actualMode === 'dark' ? '#525252' : '#a8a8a8',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: actualMode === 'dark' ? '#1a1a1a' : '#ffffff',
            borderRadius: 16,
            border: actualMode === 'dark' ? '1px solid #262626' : '1px solid #e5e7eb',
            boxShadow: actualMode === 'dark'
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: actualMode === 'dark'
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: actualMode === 'dark'
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            },
          },
          contained: {
            backgroundColor: actualMode === 'dark' ? '#6366f1' : '#6366f1',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: actualMode === 'dark' ? '#4338ca' : '#4338ca',
            },
          },
          outlined: {
            borderColor: actualMode === 'dark' ? '#404040' : '#d1d5db',
            color: actualMode === 'dark' ? '#f8fafc' : '#374151',
            '&:hover': {
              borderColor: actualMode === 'dark' ? '#6366f1' : '#6366f1',
              backgroundColor: actualMode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
            backgroundColor: actualMode === 'dark' ? '#262626' : '#f1f5f9',
            color: actualMode === 'dark' ? '#e4e4e7' : '#374151',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: actualMode === 'dark' ? '#262626' : '#f8fafc',
            color: actualMode === 'dark' ? '#f8fafc' : '#1f2937',
            borderBottom: actualMode === 'dark' ? '1px solid #404040' : '1px solid #e5e7eb',
          },
          body: {
            color: actualMode === 'dark' ? '#d4d4d8' : '#374151',
            borderBottom: actualMode === 'dark' ? '1px solid #262626' : '1px solid #f1f5f9',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: actualMode === 'dark' ? '#1a1a1a' : '#ffffff',
            color: actualMode === 'dark' ? '#f8fafc' : '#1f2937',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: actualMode === 'dark' ? '#262626' : '#ffffff',
              '& fieldset': {
                borderColor: actualMode === 'dark' ? '#404040' : '#d1d5db',
              },
              '&:hover fieldset': {
                borderColor: actualMode === 'dark' ? '#6366f1' : '#6366f1',
              },
              '&.Mui-focused fieldset': {
                borderColor: actualMode === 'dark' ? '#6366f1' : '#6366f1',
              },
            },
            '& .MuiInputLabel-root': {
              color: actualMode === 'dark' ? '#a1a1aa' : '#6b7280',
            },
            '& .MuiOutlinedInput-input': {
              color: actualMode === 'dark' ? '#f8fafc' : '#1f2937',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            backgroundColor: actualMode === 'dark' ? '#262626' : '#ffffff',
            color: actualMode === 'dark' ? '#f8fafc' : '#1f2937',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: actualMode === 'dark' ? '#f8fafc' : '#1f2937',
            '&:hover': {
              backgroundColor: actualMode === 'dark' ? '#262626' : '#f1f5f9',
            },
            '&.Mui-selected': {
              backgroundColor: actualMode === 'dark' ? '#6366f1' : '#6366f1',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: actualMode === 'dark' ? '#4338ca' : '#4338ca',
              },
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          standardInfo: {
            backgroundColor: actualMode === 'dark' ? '#1e3a8a' : '#dbeafe',
            color: actualMode === 'dark' ? '#bfdbfe' : '#1e40af',
          },
          standardSuccess: {
            backgroundColor: actualMode === 'dark' ? '#14532d' : '#dcfce7',
            color: actualMode === 'dark' ? '#bbf7d0' : '#15803d',
          },
          standardWarning: {
            backgroundColor: actualMode === 'dark' ? '#92400e' : '#fef3c7',
            color: actualMode === 'dark' ? '#fde68a' : '#92400e',
          },
          standardError: {
            backgroundColor: actualMode === 'dark' ? '#991b1b' : '#fee2e2',
            color: actualMode === 'dark' ? '#fecaca' : '#991b1b',
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, actualMode, setMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};