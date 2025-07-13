import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Paper,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import UrlBasicInfoCard from './details/UrlBasicInfoCard';
import HeadingCountsDisplay from './details/HeadingCountsDisplay';
import BrokenLinksDisplay from './details/BrokenLinksDisplay';
import LinkDistributionChart from './details/LinkDistributionChart';

import { URLAnalysis } from '../types'; 

const API_BASE_URL = 'http://localhost:8080/api';

const UrlDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [urlAnalysis, setUrlAnalysis] = useState<URLAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUrlDetails = useCallback(async () => {
    if (!id) {
      setError('URL ID not provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/urls/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('URL not found.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: URLAnalysis = await response.json();
      setUrlAnalysis(data);
    } catch (err: any) {
      setError(`Failed to fetch URL details: ${err.message}`);
      console.error("Fetch URL details error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUrlDetails();
  }, [fetchUrlDetails]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 120px)">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading URL details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!urlAnalysis) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">No data found for this URL ID.</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <UrlBasicInfoCard urlAnalysis={urlAnalysis} />
        <HeadingCountsDisplay headingCounts={urlAnalysis.heading_counts} />
        <LinkDistributionChart
          internalLinks={urlAnalysis.internal_links}
          externalLinks={urlAnalysis.external_links}
        />
        <BrokenLinksDisplay brokenLinks={urlAnalysis.inaccessible_links} />
      </Paper>
    </Container>
  );
};

export default UrlDetails;