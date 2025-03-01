import React, { useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { PeakTimesData } from 'shared/types/shared.types'; // Import PeakTimesData
import { Datum } from 'features/dashboard/components/TagCloud';

const StyledInput = styled('input')({
  margin: '0 10px',
  padding: '5px',
  fontSize: '16px',
  border: 'none',
  cursor: 'pointer',
  '&:hover': {
    color: '#1976d2',
  },
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
  '&::after': {
    content: 'none',
  },
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
  '&:-moz-focusring': {
    color: 'transparent',
    textShadow: '0 0 0 transparent',
  },
});

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

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

interface FileUploadProps {
  onUploadComplete?: (peakTimesData: PeakTimesData, wordCloudData: Datum[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const watchRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.current?.files || !watchRef.current?.files) {
      alert('Please select both search history and watch history files.');
      return;
    }

    const searchFile = searchRef.current.files[0];
    const watchFile = watchRef.current.files[0];

    const formData = new FormData();
    formData.append('search_history', searchFile);
    formData.append('watch_history', watchFile);

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/dashboard/upload-generate-dashboard`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { peak_times_data, word_cloud_data } = response.data;
      console.log('Backend Response:', response.data);
      console.log('peak_times_data:', peak_times_data);
      console.log('word_cloud_data:', word_cloud_data);

      const wordCloudArray: Datum[] = Object.entries(word_cloud_data).map(([text, value]) => ({
        text,
        value: Number(value), // Ensure value is a number
      }));

      console.log('word_cloud_array:', wordCloudArray);

      onUploadComplete?.(peak_times_data, wordCloudArray);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading or processing files. Please try again.');
    } finally {
      setIsLoading(false);
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
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <StyledSubmitButton type="submit">
            Generate My Dashboard
          </StyledSubmitButton>
        )}
      </Box>
    </Box>
  );
};