import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  ShoppingCart,
  Inventory,
  Assessment,
  Refresh,
} from '@mui/icons-material';
import { useReports } from '../hooks/useReports';
import { LineChart, BarChart, PieChart, AreaChart } from '../components/charts';

const Growth: React.FC = () => {
  const [period, setPeriod] = useState('12months');
  const [growthData, setGrowthData] = useState<any>(null);
  
  const { loading, error, getGrowthAnalytics } = useReports();

  const loadGrowthData = async () => {
    try {
      const data = await getGrowthAnalytics(period);
      setGrowthData(data);
    } catch (error) {
      console.error('Failed to load growth data:', error);
    }
  };

  useEffect(() => {
    loadGrowthData();
  }, [period]);

  const GrowthCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactElement;
    growth: number;
    color: string;
  }> = ({ title, value, icon, growth, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              {growth >= 0 ? (
                <TrendingUp color="success" fontSize="small" />
              ) : (
                <TrendingDown color="error" fontSize="small" />
              )}
              <Typography
                variant="body2"
                color={growth >= 0 ? 'success.main' : 'error.main'}
                ml={0.5}
              >
                {growth >= 0 ? '+' : ''}{growth}%
              </Typography>
              <Chip
                label={growth >= 0 ? 'Growth' : 'Decline'}
                color={growth >= 0 ? 'success' : 'error'}
                size="small"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const MetricCard: React.FC<{
    title: string;
    current: number;
    previous: number;
    unit?: string;
    format?: 'number' | 'currency' | 'percentage';
  }> = ({ title, current, previous, unit = '', format = 'number' }) => {
    const formatValue = (value: number) => {
      switch (format) {
        case 'currency':
          return `$${value.toLocaleString()}`;
        case 'percentage':
          return `${value.toFixed(1)}%`;
        default:
          return value.toLocaleString();
      }
    };

    const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {formatValue(current)}{unit}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Current Period
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body1">
                {formatValue(previous)}{unit}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Previous Period
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            {growth >= 0 ? (
              <TrendingUp color="success" fontSize="small" />
            ) : (
              <TrendingDown color="error" fontSize="small" />
            )}
            <Typography
              variant="body2"
              color={growth >= 0 ? 'success.main' : 'error.main'}
              ml={0.5}
            >
              {growth >= 0 ? '+' : ''}{growth.toFixed(1)}% vs previous period
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={loadGrowthData} variant="contained" startIcon={<Refresh />}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Growth Analytics
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Monitor your business growth metrics and trends
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={period}
            label="Time Period"
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="30days">Last 30 Days</MenuItem>
            <MenuItem value="90days">Last 90 Days</MenuItem>
            <MenuItem value="6months">Last 6 Months</MenuItem>
            <MenuItem value="12months">Last 12 Months</MenuItem>
            <MenuItem value="2years">Last 2 Years</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {growthData ? (
        <Grid container spacing={3}>
          {/* Key Growth Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <GrowthCard
              title="Customer Growth"
              value={growthData.customerGrowth?.current || 0}
              icon={<People />}
              growth={growthData.customerGrowth?.rate || 0}
              color="#10b981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GrowthCard
              title="Order Growth"
              value={growthData.orderGrowth?.current || 0}
              icon={<ShoppingCart />}
              growth={growthData.orderGrowth?.rate || 0}
              color="#6366f1"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GrowthCard
              title="Product Growth"
              value={growthData.productGrowth?.current || 0}
              icon={<Inventory />}
              growth={growthData.productGrowth?.rate || 0}
              color="#f59e0b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GrowthCard
              title="Revenue Growth"
              value={`$${(growthData.revenueGrowth?.current || 0).toLocaleString()}`}
              icon={<Assessment />}
              growth={growthData.revenueGrowth?.rate || 0}
              color="#ec4899"
            />
          </Grid>

          {/* Detailed Metrics */}
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Monthly Active Customers"
              current={growthData.monthlyActiveCustomers?.current || 0}
              previous={growthData.monthlyActiveCustomers?.previous || 0}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Average Order Value"
              current={growthData.averageOrderValue?.current || 0}
              previous={growthData.averageOrderValue?.previous || 0}
              format="currency"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Customer Retention Rate"
              current={growthData.customerRetention?.current || 0}
              previous={growthData.customerRetention?.previous || 0}
              format="percentage"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Conversion Rate"
              current={growthData.conversionRate?.current || 0}
              previous={growthData.conversionRate?.previous || 0}
              format="percentage"
            />
          </Grid>

          {/* Growth Metrics Overview */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Growth Metrics Comparison
                </Typography>
                {growthData ? (
                  <BarChart
                    data={[
                      {
                        metric: 'Revenue',
                        current: growthData.revenueGrowth?.current || 0,
                        previous: growthData.revenueGrowth?.current * 0.8 || 0
                      },
                      {
                        metric: 'Orders',
                        current: growthData.orderGrowth?.current || 0,
                        previous: growthData.orderGrowth?.current * 0.9 || 0
                      },
                      {
                        metric: 'Products',
                        current: growthData.productGrowth?.current || 0,
                        previous: growthData.productGrowth?.current * 0.95 || 0
                      },
                      {
                        metric: 'Customers',
                        current: growthData.customerGrowth?.current || 0,
                        previous: growthData.customerGrowth?.current * 0.85 || 0
                      }
                    ]}
                    xKey="metric"
                    yKey="current"
                    color="#10b981"
                    height={400}
                    formatValue={(value) => value.toLocaleString()}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      height: 400, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'grey.50',
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body1" color="textSecondary">
                      No growth data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Revenue Growth Trend */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue Growth Simulation
                </Typography>
                <LineChart
                  data={[
                    { month: 'Jan', revenue: 15000, growth: 5 },
                    { month: 'Feb', revenue: 18000, growth: 20 },
                    { month: 'Mar', revenue: 22000, growth: 22 },
                    { month: 'Apr', revenue: 25000, growth: 14 },
                    { month: 'May', revenue: 28000, growth: 12 },
                    { month: 'Jun', revenue: 32000, growth: 14 }
                  ]}
                  xKey="month"
                  yKey="revenue"
                  color="#6366f1"
                  height={300}
                  formatValue={(value) => `$${value.toLocaleString()}`}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Acquisition */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Acquisition Trend
                </Typography>
                <AreaChart
                  data={[
                    { month: 'Jan', customers: 45, new: 12 },
                    { month: 'Feb', customers: 52, new: 15 },
                    { month: 'Mar', customers: 61, new: 18 },
                    { month: 'Apr', customers: 68, new: 14 },
                    { month: 'May', customers: 76, new: 16 },
                    { month: 'Jun', customers: 85, new: 19 }
                  ]}
                  xKey="month"
                  yKey="customers"
                  color="#f59e0b"
                  height={300}
                  formatValue={(value) => `${value} customers`}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Growth Insights */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Assessment color="primary" />
                  <Typography variant="h6">
                    Growth Insights
                  </Typography>
                </Box>
                
                {/* Dynamic Insights based on actual data */}
                <Box>
                  {/* Revenue Growth Insight */}
                  <Box mb={2} p={2} sx={{ bgcolor: 'success.light', borderRadius: 1, color: 'success.contrastText' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      💰 Revenue Performance
                    </Typography>
                    <Typography variant="body2">
                      {growthData.revenueGrowth?.current > 0 
                        ? `Strong revenue generation of $${growthData.revenueGrowth.current.toLocaleString()} indicates healthy business operations.`
                        : 'Focus on increasing sales volume and average order value to boost revenue growth.'
                      }
                    </Typography>
                  </Box>

                  {/* Customer Growth Insight */}
                  <Box mb={2} p={2} sx={{ bgcolor: 'info.light', borderRadius: 1, color: 'info.contrastText' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      👥 Customer Base Analysis
                    </Typography>
                    <Typography variant="body2">
                      {growthData.customerGrowth?.current > 10
                        ? `Excellent customer base of ${growthData.customerGrowth.current} customers shows strong market presence.`
                        : 'Growing your customer base should be a priority. Consider marketing campaigns and referral programs.'
                      }
                    </Typography>
                  </Box>

                  {/* Order Volume Insight */}
                  <Box mb={2} p={2} sx={{ bgcolor: 'warning.light', borderRadius: 1, color: 'warning.contrastText' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      📦 Order Volume Trends
                    </Typography>
                    <Typography variant="body2">
                      {growthData.orderGrowth?.current > 5
                        ? `Current order volume of ${growthData.orderGrowth.current} orders shows active customer engagement.`
                        : 'Low order volume suggests need for improved customer retention and repeat purchase strategies.'
                      }
                    </Typography>
                  </Box>

                  {/* Product Portfolio Insight */}
                  <Box mb={2} p={2} sx={{ bgcolor: 'secondary.light', borderRadius: 1, color: 'secondary.contrastText' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      🛍️ Product Portfolio
                    </Typography>
                    <Typography variant="body2">
                      {growthData.productGrowth?.current > 20
                        ? `Diverse product catalog of ${growthData.productGrowth.current} items provides multiple revenue streams.`
                        : 'Consider expanding your product range to capture more market opportunities and customer needs.'
                      }
                    </Typography>
                  </Box>

                  {/* Average Order Value Insight */}
                  <Box p={2} sx={{ bgcolor: 'primary.light', borderRadius: 1, color: 'primary.contrastText' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      💳 Order Value Analysis
                    </Typography>
                    <Typography variant="body2">
                      {growthData.averageOrderValue?.current > 100
                        ? `Strong average order value of $${growthData.averageOrderValue.current.toFixed(2)} indicates effective upselling.`
                        : 'Focus on increasing average order value through bundling, upselling, and cross-selling strategies.'
                      }
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Growth Opportunities */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <TrendingUp color="success" />
                  <Typography variant="h6">
                    Growth Opportunities
                  </Typography>
                </Box>

                {/* Strategic Opportunities */}
                <Box>
                  {/* Customer Acquisition */}
                  <Box mb={2} p={2} sx={{ bgcolor: 'success.light', borderRadius: 1, border: '1px solid', borderColor: 'success.main' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom color="success.dark">
                      🎯 Customer Acquisition
                    </Typography>
                    <Typography variant="body2" color="success.dark">
                      • Launch targeted digital marketing campaigns
                    </Typography>
                    <Typography variant="body2" color="success.dark">
                      • Implement referral reward programs
                    </Typography>
                    <Typography variant="body2" color="success.dark">
                      • Expand social media presence and engagement
                    </Typography>
                  </Box>

                  {/* Revenue Optimization */}
                  <Box mb={2} p={2} sx={{ bgcolor: 'primary.light', borderRadius: 1, border: '1px solid', borderColor: 'primary.main' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom color="primary.dark">
                      💰 Revenue Optimization
                    </Typography>
                    <Typography variant="body2" color="primary.dark">
                      • Introduce premium product lines
                    </Typography>
                    <Typography variant="body2" color="primary.dark">
                      • Implement dynamic pricing strategies
                    </Typography>
                    <Typography variant="body2" color="primary.dark">
                      • Create subscription or membership models
                    </Typography>
                  </Box>

                  {/* Operational Excellence */}
                  <Box mb={2} p={2} sx={{ bgcolor: 'info.light', borderRadius: 1, border: '1px solid', borderColor: 'info.main' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom color="info.dark">
                      ⚡ Operational Excellence
                    </Typography>
                    <Typography variant="body2" color="info.dark">
                      • Automate inventory management processes
                    </Typography>
                    <Typography variant="body2" color="info.dark">
                      • Optimize supply chain efficiency
                    </Typography>
                    <Typography variant="body2" color="info.dark">
                      • Implement predictive analytics for demand forecasting
                    </Typography>
                  </Box>

                  {/* Market Expansion */}
                  <Box mb={2} p={2} sx={{ bgcolor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom color="warning.dark">
                      🌍 Market Expansion
                    </Typography>
                    <Typography variant="body2" color="warning.dark">
                      • Explore new geographic markets
                    </Typography>
                    <Typography variant="body2" color="warning.dark">
                      • Develop partnerships with complementary businesses
                    </Typography>
                    <Typography variant="body2" color="warning.dark">
                      • Consider B2B sales channels alongside B2C
                    </Typography>
                  </Box>

                  {/* Technology Innovation */}
                  <Box p={2} sx={{ bgcolor: 'secondary.light', borderRadius: 1, border: '1px solid', borderColor: 'secondary.main' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom color="secondary.dark">
                      🚀 Technology Innovation
                    </Typography>
                    <Typography variant="body2" color="secondary.dark">
                      • Implement AI-powered recommendation systems
                    </Typography>
                    <Typography variant="body2" color="secondary.dark">
                      • Develop mobile app for better customer experience
                    </Typography>
                    <Typography variant="body2" color="secondary.dark">
                      • Integrate IoT for real-time inventory tracking
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Growth Action Plan */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Assessment color="primary" />
                  <Typography variant="h6">
                    30-Day Growth Action Plan
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Week 1 Actions */}
                  <Grid item xs={12} md={3}>
                    <Box p={2} sx={{ bgcolor: 'primary.light', borderRadius: 2, height: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary.dark" gutterBottom>
                        Week 1: Foundation
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, color: 'primary.dark' }}>
                        <Typography component="li" variant="body2" mb={1}>
                          Analyze current customer data
                        </Typography>
                        <Typography component="li" variant="body2" mb={1}>
                          Identify top-performing products
                        </Typography>
                        <Typography component="li" variant="body2" mb={1}>
                          Set up tracking metrics
                        </Typography>
                        <Typography component="li" variant="body2">
                          Review pricing strategy
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Week 2 Actions */}
                  <Grid item xs={12} md={3}>
                    <Box p={2} sx={{ bgcolor: 'success.light', borderRadius: 2, height: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="success.dark" gutterBottom>
                        Week 2: Optimization
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, color: 'success.dark' }}>
                        <Typography component="li" variant="body2" mb={1}>
                          Launch customer survey
                        </Typography>
                        <Typography component="li" variant="body2" mb={1}>
                          Optimize product listings
                        </Typography>
                        <Typography component="li" variant="body2" mb={1}>
                          Implement cross-selling
                        </Typography>
                        <Typography component="li" variant="body2">
                          Start email marketing
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Week 3 Actions */}
                  <Grid item xs={12} md={3}>
                    <Box p={2} sx={{ bgcolor: 'warning.light', borderRadius: 2, height: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="warning.dark" gutterBottom>
                        Week 3: Expansion
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, color: 'warning.dark' }}>
                        <Typography component="li" variant="body2" mb={1}>
                          Launch referral program
                        </Typography>
                        <Typography component="li" variant="body2" mb={1}>
                          Expand product catalog
                        </Typography>
                        <Typography component="li" variant="body2" mb={1}>
                          Partner with influencers
                        </Typography>
                        <Typography component="li" variant="body2">
                          Optimize checkout process
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Week 4 Actions */}
                  <Grid item xs={12} md={3}>
                    <Box p={2} sx={{ bgcolor: 'info.light', borderRadius: 2, height: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="info.dark" gutterBottom>
                        Week 4: Scale
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, color: 'info.dark' }}>
                        <Typography component="li" variant="body2" mb={1}>
                          Analyze campaign results
                        </Typography>
                        <Typography component="li" variant="body2" mb={1}>
                          Scale successful initiatives
                        </Typography>
                        <Typography component="li" variant="body2" mb={1}>
                          Plan next month's strategy
                        </Typography>
                        <Typography component="li" variant="body2">
                          Set new growth targets
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Key Performance Indicators */}
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Key Performance Indicators (KPIs) to Track
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2} sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          {growthData.customerGrowth?.current || 0}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Active Customers
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          Target: +20% monthly
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2} sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          ${(growthData.averageOrderValue?.current || 0).toFixed(0)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Avg Order Value
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          Target: $150+
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2} sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          {((growthData.customerRetention?.current || 0) * 100).toFixed(0)}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Customer Retention
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          Target: 85%+
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box textAlign="center" p={2} sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="h4" color="info.main" fontWeight="bold">
                          {growthData.orderGrowth?.current || 0}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Monthly Orders
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          Target: +15% monthly
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <TrendingUp sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Growth Data Available
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Growth analytics will appear here once you have sufficient business data
            </Typography>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={loadGrowthData}
            >
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Growth;