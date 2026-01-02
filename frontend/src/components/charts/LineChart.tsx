import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';

interface LineChartProps {
  data: any[];
  title?: string;
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  formatValue?: (value: any) => string;
}

const LineChart: React.FC<LineChartProps> = ({
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
        <RechartsLineChart data={data}>
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
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LineChart;