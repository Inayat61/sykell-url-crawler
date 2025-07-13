import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { BrokenLink } from '../../types';

interface BrokenLinksDisplayProps {
  brokenLinks: BrokenLink[];
}

const BrokenLinksDisplay: React.FC<BrokenLinksDisplayProps> = ({ brokenLinks }) => {
  if (brokenLinks.length === 0) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Inaccessible Links (0):
        </Typography>
        <Typography variant="body2" color="text.secondary">None found.</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Inaccessible Links ({brokenLinks.length}):
      </Typography>
      <List dense disablePadding>
        {brokenLinks.map((link, index) => (
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
    </Box>
  );
};

export default BrokenLinksDisplay;