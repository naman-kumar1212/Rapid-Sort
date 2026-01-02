import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import './App.css';

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { ClarityProvider } from './contexts/ClarityContext';

// Components - Only import what's needed immediately
import Navbar from './components/Navbar';
import LandingPage from './components/auth/LandingPage';
import WelcomeModal from './components/auth/WelcomeModal';

// Lazy load components to reduce initial bundle size
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProductList = React.lazy(() => import('./components/ProductList'));
const AddProduct = React.lazy(() => import('./components/AddProduct'));
const EditProduct = React.lazy(() => import('./components/EditProduct'));
const BulkOperations = React.lazy(() => import('./components/BulkOperations'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Customers = React.lazy(() => import('./pages/Customers'));
const Suppliers = React.lazy(() => import('./pages/Suppliers'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Revenue = React.lazy(() => import('./pages/Revenue'));
const Growth = React.lazy(() => import('./pages/Growth'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const About = React.lazy(() => import('./pages/About'));
const Features = React.lazy(() => import('./pages/Features'));

// Optimized loading component
const LoadingSpinner = React.memo(() => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="300px"
  >
    <CircularProgress size={32} />
  </Box>
));

// Main App Routes Component
const AppRoutes: React.FC = () => {
  const { user, loading, showWelcome, setShowWelcome } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // Show landing page or public pages if user is not authenticated
  if (!user) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
        </Routes>
      </Suspense>
    );
  }

  // Show app routes if user is authenticated
  return (
    <>
      <div className="App">
        <Navbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - 280px)` },
            ml: { md: `280px` },
            mt: { xs: 8, md: 8 }, // Account for AppBar height
            backgroundColor: 'background.default',
            minHeight: '100vh',
            color: 'text.primary',
          }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
              <Route path="/bulk-operations" element={<BulkOperations />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/growth" element={<Growth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </Suspense>
        </Box>
      </div>

      {/* Welcome Modal for new users */}
      {user && (
        <WelcomeModal
          open={showWelcome}
          onClose={() => setShowWelcome(false)}
          userName={`${user.firstName} ${user.lastName}`}
        />
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <WebSocketProvider>
            <Router>
              <ClarityProvider>
                <AppRoutes />
              </ClarityProvider>
            </Router>
          </WebSocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;