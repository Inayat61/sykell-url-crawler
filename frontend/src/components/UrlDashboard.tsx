// frontend/src/components/UrlDashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Alert, Typography } from '@mui/material';

// Import new sub-components
import UrlDashboardHeader from './dashboard/UrlDashboardHeader';
import UrlAnalysisTable from './dashboard/UrlAnalysisTable';

import { URLAnalysis } from '../types'; // Adjust path if needed

interface UrlDashboardProps {
  refreshTrigger: number;
}

const API_BASE_URL = 'http://localhost:8080/api';

const UrlDashboard: React.FC<UrlDashboardProps> = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState<URLAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggeringCrawlId, setTriggeringCrawlId] = useState<number | null>(null);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/urls`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: URLAnalysis[] = await response.json();
      setUrls(data);
    } catch (err: any) {
      setError(`Failed to fetch URLs: ${err.message}`);
      console.error("Fetch URLs error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [refreshTrigger, fetchUrls]);

  const handleTriggerCrawl = async (id: number) => {
    setTriggeringCrawlId(id);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/urls/${id}/crawl`, {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to trigger crawl');
      }
      // Optimistically update the status to 'running'
      setUrls(prevUrls =>
        prevUrls.map(url =>
          url.id === id ? { ...url, status: 'running', updated_at: new Date().toISOString() } : url
        )
      );
    } catch (err: any) {
      setError(`Error triggering crawl: ${err.message}`);
      console.error("Trigger crawl error:", err);
    } finally {
      setTriggeringCrawlId(null);
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/urls/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading URLs...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (urls.length === 0) {
    return <Alert severity="info">No URLs added yet. Add a URL above to get started!</Alert>;
  }

  return (
    <>
      <UrlDashboardHeader onRefresh={fetchUrls} loading={loading} />
      <UrlAnalysisTable
        urls={urls}
        onTriggerCrawl={handleTriggerCrawl}
        onViewDetails={handleViewDetails}
        triggeringCrawlId={triggeringCrawlId}
      />
    </>
  );
};

export default UrlDashboard;