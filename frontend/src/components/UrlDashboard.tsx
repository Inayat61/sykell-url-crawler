// frontend/src/components/UrlDashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- IMPORT useNavigate
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';

import { URLAnalysis, AnalysisStatus } from '../types';

interface UrlDashboardProps {
  refreshTrigger: number;
}

const API_BASE_URL = 'http://localhost:8080/api';

const UrlDashboard: React.FC<UrlDashboardProps> = ({ refreshTrigger }) => {
  const navigate = useNavigate(); // <--- INITIALIZE useNavigate
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

  // --- NEW FUNCTION TO HANDLE NAVIGATION TO DETAILS ---
  const handleViewDetails = (id: number) => {
    navigate(`/urls/${id}`);
  };
  // --- END NEW FUNCTION ---

  const getStatusChipColor = (status: AnalysisStatus) => {
    switch (status) {
      case 'queued': return 'default';
      case 'running': return 'info';
      case 'done': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
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
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h5" component="h2">
          Analysis Results
        </Typography>
        <Button
          variant="outlined"
          onClick={fetchUrls}
          startIcon={<RefreshIcon />}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="URL analysis table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>HTML Version</TableCell>
            <TableCell>H1/H2 Counts</TableCell>
            <TableCell>Links (Int/Ext)</TableCell>
            <TableCell>Login Form</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {urls.map((urlAnalysis) => (
            <TableRow key={urlAnalysis.id}>
              <TableCell>{urlAnalysis.id}</TableCell>
              <TableCell>
                <a href={urlAnalysis.url} target="_blank" rel="noopener noreferrer">
                  {urlAnalysis.url}
                </a>
              </TableCell>
              <TableCell>
                <Chip
                  label={urlAnalysis.status.charAt(0).toUpperCase() + urlAnalysis.status.slice(1)}
                  color={getStatusChipColor(urlAnalysis.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{urlAnalysis.page_title || 'N/A'}</TableCell>
              <TableCell>{urlAnalysis.html_version || 'N/A'}</TableCell>
              <TableCell>
                H1: {urlAnalysis.heading_counts.h1} <br />
                H2: {urlAnalysis.heading_counts.h2}
              </TableCell>
              <TableCell>
                Int: {urlAnalysis.internal_links} <br />
                Ext: {urlAnalysis.external_links}
              </TableCell>
              <TableCell>{urlAnalysis.has_login_form ? 'Yes' : 'No'}</TableCell>
              <TableCell>{formatDate(urlAnalysis.updated_at)}</TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleTriggerCrawl(urlAnalysis.id)}
                  disabled={urlAnalysis.status === 'running' || triggeringCrawlId === urlAnalysis.id}
                  sx={{ mr: 1 }}
                >
                  {urlAnalysis.status === 'running' ? 'Running...' : 'Crawl'}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<InfoIcon />}
                  onClick={() => handleViewDetails(urlAnalysis.id)} 
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UrlDashboard;