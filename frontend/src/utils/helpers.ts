import { AnalysisStatus } from '../types'; 
import { ChipProps } from '@mui/material/Chip';

export const getStatusChipColor = (status: AnalysisStatus): ChipProps['color'] => {
  switch (status) {
    case 'queued': return 'default';
    case 'running': return 'info';
    case 'done': return 'success';
    case 'error': return 'error';
    default: return 'default';
  }
};

export const formatDate = (isoString: string): string => {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return 'Invalid Date';
  }
};