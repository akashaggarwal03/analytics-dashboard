import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

// Basic styled input for file uploads
const StyledInput = styled('input')({
  margin: '0 10px',
  padding: '5px',
  fontSize: '16px',
  border: 'none', // Remove the square box (border)
  cursor: 'pointer',
  '&:hover': {
    color: '#1976d2', // Optional: Change text color on hover
  },
  // Hide the "No file chosen" text by targeting the input's default appearance
  '&::-webkit-file-upload-button': {
    marginRight: '10px',
    padding: '5px 10px',
    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      background: 'linear-gradient(45deg, #1565c0 30%, #2196f3 90%)',
    },
  },
  // Remove the "No file chosen" text in Chrome/Edge
  '&::after': {
    content: 'none',
  },
  // Remove the default file input appearance in Firefox
  '&::-moz-file-upload-button': {
    marginRight: '10px',
    padding: '5px 10px',
    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      background: 'linear-gradient(45deg, #1565c0 30%, #2196f3 90%)',
    },
  },
  // Hide the default text in Firefox
  '&:-moz-focusring': {
    color: 'transparent',
    textShadow: '0 0 0 transparent',
  },
});

// Basic styled button for Generate My Dashboard
const StyledSubmitButton = styled('button')({
  background: 'linear-gradient(45deg, #ff4081 30%, #f50057 90%)',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
  margin: '10px 0',
  '&:hover': {
    background: 'linear-gradient(45deg, #f06292 30%, #e91e63 90%)',
  },
});

const API_URL = 'http://127.0.0.1:8000/dashboard/upload-generate-dashboard';

interface FileUploadProps {
  onUploadStart?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadStart }) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const watchRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.current?.files || !watchRef.current?.files) return;

    const formData = new FormData();
    formData.append('search_history', searchRef.current.files[0]);
    formData.append('watch_history', watchRef.current.files[0]);

    try {
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadStart?.();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>Search History</span>
          <StyledInput
            type="file"
            accept=".json"
            ref={searchRef}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: "10px" }}>Watch History</span>
          <StyledInput
            type="file"
            accept=".json"
            ref={watchRef}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <StyledSubmitButton type="submit">
          Generate My Dashboard
        </StyledSubmitButton>
      </Box>
    </Box>
  );
};