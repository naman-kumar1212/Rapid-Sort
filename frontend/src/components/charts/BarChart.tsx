import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';

interface BarChartProps {
  data: any[];
  title?: string;
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  formatValue?: (value: any) => string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  xKey,
  yKey,
  color = '#82ca9d',
  height = 300,
  formatValue = (value) => value?.toString() || '0',
}) => {
  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={formatValue}
          />
          <Tooltip 
            formatter={(value) => [formatValue(value), yKey]}
            labelStyle={{ color: '#666' }}
          />
          <Legend />
          <Bar
            dataKey={yKey}
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChart;