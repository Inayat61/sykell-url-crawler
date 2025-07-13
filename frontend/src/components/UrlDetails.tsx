// frontend/src/components/UrlDetails.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Import Recharts components
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import { URLAnalysis, AnalysisStatus, HeadingCounts, BrokenLink } from '../types';

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

  const renderHeadingCounts = (counts: HeadingCounts) => (
    <List dense disablePadding>
      {Object.entries(counts).map(([key, value]) => (
        <ListItem key={key} sx={{ py: 0.5 }}>
          <ListItemText primary={`${key.toUpperCase()}: ${value}`} />
        </ListItem>
      ))}
    </List>
  );

  const renderInaccessibleLinks = (links: BrokenLink[]) => {
    if (links.length === 0) {
      return <Typography variant="body2" color="text.secondary">None found.</Typography>;
    }
    return (
      <List dense disablePadding>
        {links.map((link, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                  {link.url}
                </a>
              }
              secondary={`Status: ${link.status_code || 'Network Error'}`}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const linkChartData = [
    { name: 'Internal Links', value: urlAnalysis.internal_links },
    { name: 'External Links', value: urlAnalysis.external_links },
  ];
  const COLORS = ['#0088FE', '#FFBB28'];

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
        <Typography
          variant="h5" // Default for larger screens
          component="h2"
          gutterBottom
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' } // Responsive font size
          }}
        >
          Details for URL: <a href={urlAnalysis.url} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{urlAnalysis.url}</a>
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">ID:</Typography>
            <Typography variant="body1">{urlAnalysis.id}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Status:</Typography>
            <Chip
              label={urlAnalysis.status.charAt(0).toUpperCase() + urlAnalysis.status.slice(1)}
              color={getStatusChipColor(urlAnalysis.status)}
            />
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Page Title:</Typography>
            <Typography variant="body1">{urlAnalysis.page_title || 'N/A'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">HTML Version:</Typography>
            <Typography variant="body1">{urlAnalysis.html_version || 'N/A'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Internal Links:</Typography>
            <Typography variant="body1">{urlAnalysis.internal_links}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">External Links:</Typography>
            <Typography variant="body1">{urlAnalysis.external_links}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Has Login Form:</Typography>
            <Typography variant="body1">{urlAnalysis.has_login_form ? 'Yes' : 'No'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Created At:</Typography>
            <Typography variant="body1">{formatDate(urlAnalysis.created_at)}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Last Updated At:</Typography>
            <Typography variant="body1">{formatDate(urlAnalysis.updated_at)}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Heading Counts:</Typography>
          {renderHeadingCounts(urlAnalysis.heading_counts)}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Link Distribution:</Typography>
          {(urlAnalysis.internal_links === 0 && urlAnalysis.external_links === 0) ? (
            <Typography variant="body2" color="text.secondary">No links found on the page.</Typography>
          ) : (
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
                  label={({ name, percent }) => `${name}: ${((percent || 0 ) * 100).toFixed(0)}%`}
                >
                  {linkChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Inaccessible Links ({urlAnalysis.inaccessible_links.length}):
          </Typography>
          {renderInaccessibleLinks(urlAnalysis.inaccessible_links)}
        </Box>
      </Paper>
    </Container>
  );
};

export default UrlDetails;