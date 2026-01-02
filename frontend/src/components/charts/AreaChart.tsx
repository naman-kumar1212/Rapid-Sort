import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';

interface AreaChartProps {
  data: any[];
  title?: string;
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  formatValue?: (value: any) => string;
}

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  title,
  xKey,
  yKey,
  color = '#8884d8',
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
        <RechartsAreaChart data={data}>
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
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={color}
            fill={color}
            fillOpacity={0.3}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AreaChart;