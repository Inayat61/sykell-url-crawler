// frontend/src/components/dashboard/UrlAnalysisTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { URLAnalysis } from '../../types'; // Adjust path if needed
import UrlTableRow from './UrlTableRow'; // Import the new row component

interface UrlAnalysisTableProps {
  urls: URLAnalysis[];
  onTriggerCrawl: (id: number) => void;
  onViewDetails: (id: number) => void;
  triggeringCrawlId: number | null;
}

const UrlAnalysisTable: React.FC<UrlAnalysisTableProps> = ({
  urls,
  onTriggerCrawl,
  onViewDetails,
  triggeringCrawlId,
}) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4, overflowX: 'auto' }}>
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
            <UrlTableRow
              key={urlAnalysis.id}
              urlAnalysis={urlAnalysis}
              onTriggerCrawl={onTriggerCrawl}
              onViewDetails={onViewDetails}
              isCrawlTriggering={triggeringCrawlId === urlAnalysis.id}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UrlAnalysisTable;