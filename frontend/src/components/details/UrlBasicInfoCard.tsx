import React from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import { URLAnalysis } from '../../types'; 
import { getStatusChipColor, formatDate } from '../../utils/helpers'; 

interface UrlBasicInfoCardProps {
  urlAnalysis: URLAnalysis;
}

const UrlBasicInfoCard: React.FC<UrlBasicInfoCardProps> = ({ urlAnalysis }) => {
  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' }
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
    </Box>
  );
};

export default UrlBasicInfoCard;