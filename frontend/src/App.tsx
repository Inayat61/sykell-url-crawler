// frontend/src/App.tsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import UrlInputForm from './components/UrlInputForm';
import UrlDashboard from './components/UrlDashboard'; // Import UrlDashboard

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlAdded = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger re-fetch in dashboard
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

        <UrlInputForm onUrlAdded={handleUrlAdded} />

        <UrlDashboard refreshTrigger={refreshTrigger} /> {/* Integrate UrlDashboard */}

      </Container>
    </Box>
  );
}

export default App;