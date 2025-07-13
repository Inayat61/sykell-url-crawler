// frontend/src/App.tsx
import React, { useState } from 'react'; // Import useState
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import UrlInputForm from './components/UrlInputForm'; // Import UrlInputForm

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger URL list refresh

  const handleUrlAdded = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger re-fetch in child component
  };

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sykell URL Crawler
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Website Analysis Dashboard
        </Typography>

        <UrlInputForm onUrlAdded={handleUrlAdded} /> {/* Integrate URL input form */}

        {/* Placeholder for Results Dashboard - will be a new component */}
        {/* For now, you can pass refreshTrigger to a dummy component to see it change */}
        <Typography variant="h5" sx={{mt: 4}}>
          URLs List (will be here, refresh trigger: {refreshTrigger})
        </Typography>
      </Container>
    </Box>
  );
}

export default App;