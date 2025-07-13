// frontend/src/components/dashboard/UrlTableRow.tsx
import React from 'react';
import { TableCell, TableRow, Chip, Box, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import { URLAnalysis, AnalysisStatus } from '../../types'; // Adjust path if needed

interface UrlTableRowProps {
  urlAnalysis: URLAnalysis;
  onTriggerCrawl: (id: number) => void;
  onViewDetails: (id: number) => void;
  isCrawlTriggering: boolean;
}

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

const UrlTableRow: React.FC<UrlTableRowProps> = ({
  urlAnalysis,
  onTriggerCrawl,
  onViewDetails,
  isCrawlTriggering,
}) => {
  return (
    <TableRow key={urlAnalysis.id}>
      <TableCell>{urlAnalysis.id}</TableCell>
      <TableCell sx={{ wordBreak: 'break-all' }}>
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
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 0.5, sm: 1 },
            alignItems: 'flex-end'
        }}>
            <Button
            variant="outlined"
            size="small"
            startIcon={<PlayArrowIcon />}
            onClick={() => onTriggerCrawl(urlAnalysis.id)}
            disabled={urlAnalysis.status === 'running' || isCrawlTriggering}
            >
            {urlAnalysis.status === 'running' ? 'Running...' : 'Crawl'}
            </Button>
            <Button
            variant="outlined"
            size="small"
            startIcon={<InfoIcon />}
            onClick={() => onViewDetails(urlAnalysis.id)}
            >
            Details
            </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default UrlTableRow;