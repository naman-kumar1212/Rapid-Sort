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
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  ShoppingCart,
  Assessment,
  Refresh,
} from '@mui/icons-material';
import { useReports } from '../hooks/useReports';
import { LineChart, BarChart, PieChart, AreaChart } from '../components/charts';

const Revenue: React.FC = () => {
  const [period, setPeriod] = useState('12months');
  const [revenueData, setRevenueData] = useState<any>(null);
  
  const { loading, error, getRevenueAnalytics } = useReports();

  const loadRevenueData = async () => {
    try {
      const data = await getRevenueAnalytics(period);
      setRevenueData(data);
    } catch (error) {
      console.error('Failed to load revenue data:', error);
    }
  };

  useEffect(() => {
    loadRevenueData();
  }, [period]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactElement;
    trend?: number;
    color: string;
  }> = ({ title, value, icon, trend, color }) => (
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
            {trend !== undefined && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp 
                  color={trend >= 0 ? "success" : "error"} 
                  fontSize="small" 
                />
                <Typography
                  variant="body2"
                  color={trend >= 0 ? 'success.main' : 'error.main'}
                  ml={0.5}
                >
                  {trend >= 0 ? '+' : ''}{trend}%
                </Typography>
              </Box>
            )}
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
        <Button onClick={loadRevenueData} variant="contained" startIcon={<Refresh />}>
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
            Revenue Analytics
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Track and analyze your revenue performance over time
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

      {revenueData ? (
        <Grid container spacing={3}>
          {/* Revenue Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={`$${(revenueData.summary?.totalRevenue || 0).toLocaleString()}`}
              icon={<AttachMoney />}
              trend={15}
              color="#10b981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Average Order Value"
              value={`$${(revenueData.summary?.avgValue || 0).toFixed(2)}`}
              icon={<ShoppingCart />}
              trend={8}
              color="#6366f1"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={(revenueData.summary?.totalOrders || 0).toLocaleString()}
              icon={<TrendingUp />}
              trend={12}
              color="#f59e0b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Sales Performance"
              value={`${(revenueData.salesOverTime || []).length} Days`}
              icon={<Assessment />}
              trend={5}
              color="#ec4899"
            />
          </Grid>

          {/* Revenue Trend Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                {revenueData.salesOverTime && revenueData.salesOverTime.length > 0 ? (
                  <AreaChart
                    data={revenueData.salesOverTime.map((item: any) => ({
                      date: new Date(item._id).toLocaleDateString(),
                      revenue: item.totalSales || 0,
                      orders: item.orderCount || 0
                    }))}
                    title="Revenue Trend Over Time"
                    xKey="date"
                    yKey="revenue"
                    color="#10b981"
                    height={400}
                    formatValue={(value) => `$${value.toLocaleString()}`}
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
                      No revenue data available for chart
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Daily Orders Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                {revenueData.salesOverTime && revenueData.salesOverTime.length > 0 ? (
                  <BarChart
                    data={revenueData.salesOverTime.map((item: any) => ({
                      date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      orders: item.orderCount || 0,
                      revenue: item.totalSales || 0
                    }))}
                    title="Daily Order Volume"
                    xKey="date"
                    yKey="orders"
                    color="#6366f1"
                    height={300}
                    formatValue={(value) => `${value} orders`}
                  />
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      No order data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Revenue by Status */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                {revenueData.salesByStatus && revenueData.salesByStatus.length > 0 ? (
                  <PieChart
                    data={revenueData.salesByStatus.map((item: any) => ({
                      name: item._id || 'Unknown',
                      value: item.totalValue || 0
                    }))}
                    title="Revenue by Order Status"
                    dataKey="value"
                    nameKey="name"
                    height={300}
                    formatValue={(value) => `$${value.toLocaleString()}`}
                  />
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      No status data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Revenue Breakdown */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue by Status
                </Typography>
                {revenueData.salesByStatus?.map((status: any, index: number) => (
                  <Box key={index} mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{status._id}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ${status.totalValue?.toLocaleString() || '0'}
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        height: 8, 
                        bgcolor: 'grey.200', 
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${Math.min((status.totalValue / (revenueData.summary?.totalRevenue || 1)) * 100, 100)}%`,
                          bgcolor: `hsl(${index * 60}, 70%, 50%)`,
                          borderRadius: 1
                        }}
                      />
                    </Box>
                  </Box>
                )) || (
                  <Typography variant="body2" color="textSecondary">
                    No sales data available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Top Revenue Sources */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Revenue Sources
                </Typography>
                {revenueData.topRevenueSources?.map((source: any, index: number) => (
                  <Box key={index} display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body2">{source.name}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ${source.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                )) || (
                  <Typography variant="body2" color="textSecondary">
                    No revenue source data available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <AttachMoney sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Revenue Data Available
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Revenue analytics will appear here once you have sales data
            </Typography>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={loadRevenueData}
            >
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Revenue;