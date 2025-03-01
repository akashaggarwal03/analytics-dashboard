import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';

// Define the Datum type for tag data
interface Datum {
  text: string;
  value: number;
  rotate?: number;
  [key: string]: any;
}

interface TagCloudProps {
  data: Datum[];
}

interface Tag {
  text: string;
  value: number;
  fontSize: number;
  color: string;
}

export const TagCloud: React.FC<TagCloudProps> = ({ data }) => {
  // Generate random pastel colors for tags
  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360); // Random hue (0-360)
    return `hsl(${hue}, 70%, 80%)`; // Pastel color with 70% saturation, 80% lightness
  };

  // Map data to include styles for each tag
  const tags = useMemo(() => {
    return data.map(item => ({
      text: item.text,
      value: item.value,
      fontSize: Math.log2(item.value) * 15, // Same scaling as before
      color: getRandomColor(),
    }));
  }, [data]);

  return (
    <Box sx={{ mt: 4, px: 2, textAlign: 'center' }}>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          color: 'white', // Explicitly set to black for high contrast
          '&': { color: 'white !important' }, // Override any conflicting styles
          backgroundColor: 'black',
          padding: '8px',
          borderRadius: '4px',
          display: 'inline-block',
        }}
      >
        Top Search Terms!
      </Typography>
      {data.length > 0 ? (
        <Box
          sx={{
            width: '100%',
            minHeight: '400px', // Allow the container to grow with content
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: 'white',
            display: 'flex',
            flexWrap: 'wrap', // Wrap tags to next line
            justifyContent: 'center', // Center tags horizontally
            alignContent: 'flex-start', // Start from the top
            gap: '10px', // Space between tags
            padding: '20px', // Inner padding for the container
            boxSizing: 'border-box',
          }}
        >
          {tags.map((tag, index) => (
            <Box
              key={index}
              sx={{
                fontSize: `${tag.fontSize}px`,
                color: tag.color,
                padding: '6px 12px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
                whiteSpace: 'nowrap', // Prevent text wrapping within tags
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
              }}
            >
              {tag.text}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No search data available.
        </Typography>
      )}
    </Box>
  );
};