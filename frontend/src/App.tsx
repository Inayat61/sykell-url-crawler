import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';

import UrlInputForm from './components/UrlInputForm';
import UrlDashboard from './components/UrlDashboard';
import UrlDetails from './components/UrlDetails'; 

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlAdded = () => {
    setRefreshTrigger(prev => prev + 1);
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
        <Routes>
          <Route path="/" element={
            <>
              <Typography variant="h4" component="h1" gutterBottom>
                Website Analysis Dashboard
              </Typography>
              <UrlInputForm onUrlAdded={handleUrlAdded} />
              <UrlDashboard refreshTrigger={refreshTrigger} />
            </>
          } />
          <Route path="/urls/:id" element={<UrlDetails />} /> 
          <Route path="*" element={<Typography variant="h5" sx={{mt: 5}}>404 - Page Not Found</Typography>} /> 
        </Routes> 
      </Container>
    </Box>
  );
}

export default App;