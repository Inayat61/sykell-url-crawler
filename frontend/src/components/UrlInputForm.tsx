// frontend/src/components/UrlInputForm.tsx
import React, { useState } from 'react';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface UrlInputFormProps {
  onUrlAdded: () => void; // Callback to refresh data after adding
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({ onUrlAdded }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastResponseStatus, setLastResponseStatus] = useState<number | null>(null); // New state for response status

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLastResponseStatus(null); // Reset status on new submission
    setLoading(true);

    try {
      // Basic URL validation
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        setError('URL must start with http:// or https://');
        setLoading(false);
        return;
      }
      new URL(url); // Further validation by URL constructor (throws if invalid)

      const response = await fetch('http://localhost:8080/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      setLastResponseStatus(response.status); // Store the status

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add URL');
        // Specific handling for 409 Conflict
        if (response.status === 409) {
            setSuccess(`URL already exists: ID ${data.id}`);
            onUrlAdded(); // Still refresh if it existed
        }
        return;
      }

      setSuccess(`URL added successfully! ID: ${data.id}`);
      setUrl(''); // Clear input
      onUrlAdded(); // Notify parent to refresh list
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        alignItems: 'flex-start',
        flexDirection: { xs: 'column', sm: 'row' },
      }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Website URL"
        variant="outlined"
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        error={!!error}
        helperText={error}
        disabled={loading}
        sx={{ flexGrow: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
        disabled={loading || !url.trim()}
        sx={{ flexShrink: 0, height: '56px' }} // Match TextField height
      >
        {loading ? 'Adding...' : 'Add URL'}
      </Button>

      {success && (
        <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
          {success}
        </Alert>
      )}
      {error && lastResponseStatus !== 409 && ( // Use lastResponseStatus here
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default UrlInputForm;