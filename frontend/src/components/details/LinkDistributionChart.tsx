import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface LinkDistributionChartProps {
  internalLinks: number;
  externalLinks: number;
}

const COLORS = ['#0088FE', '#FFBB28'];

const LinkDistributionChart: React.FC<LinkDistributionChartProps> = ({ internalLinks, externalLinks }) => {
  const linkChartData = [
    { name: 'Internal Links', value: internalLinks },
    { name: 'External Links', value: externalLinks },
  ];

  if (internalLinks === 0 && externalLinks === 0) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Link Distribution:</Typography>
        <Typography variant="body2" color="text.secondary">No links found on the page.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Link Distribution:</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={linkChartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
          >
            {linkChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LinkDistributionChart;