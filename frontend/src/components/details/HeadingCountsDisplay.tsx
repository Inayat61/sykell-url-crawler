import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { HeadingCounts } from '../../types'; 

interface HeadingCountsDisplayProps {
  headingCounts: HeadingCounts;
}

const HeadingCountsDisplay: React.FC<HeadingCountsDisplayProps> = ({ headingCounts }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Heading Counts:</Typography>
      <List dense disablePadding>
        {Object.entries(headingCounts).map(([key, value]) => (
          <ListItem key={key} sx={{ py: 0.5 }}>
            <ListItemText primary={`${key.toUpperCase()}: ${value}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default HeadingCountsDisplay;