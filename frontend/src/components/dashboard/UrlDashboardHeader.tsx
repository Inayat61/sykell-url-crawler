// frontend/src/components/dashboard/UrlDashboardHeader.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface UrlDashboardHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

const UrlDashboardHeader: React.FC<UrlDashboardHeaderProps> = ({ onRefresh, loading }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
      <Typography variant="h5" component="h2">
        Analysis Results
      </Typography>
      <Button
        variant="outlined"
        onClick={onRefresh}
        startIcon={<RefreshIcon />}
        disabled={loading}
      >
        Refresh
      </Button>
    </Box>
  );
};

export default UrlDashboardHeader;