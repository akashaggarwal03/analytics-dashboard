import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';

interface FirstVideoPlayerProps {
  videoUrl?: string;
  videoTitle?: string;
  videoTimestamp?: string;
}

export const FirstVideoPlayer: React.FC<FirstVideoPlayerProps> = ({ videoUrl, videoTitle, videoTimestamp }) => {
  // Extract video ID from URL (e.g., https://www.youtube.com/watch?v=abc123 -> abc123)
  const videoId = useMemo(() => {
    if (!videoUrl) return null;
    const match = videoUrl.match(/(?:v=)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }, [videoUrl]);

  // Format the timestamp for display (e.g., "2023-01-01T12:00:00Z" -> "January 1, 2023, 12:00 PM")
  const formattedTimestamp = useMemo(() => {
    if (!videoTimestamp) return 'Unknown Time';
    const date = new Date(videoTimestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }, [videoTimestamp]);

  if (!videoId) {
    return (
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No first video available.
        </Typography>
      </Box>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0`;

  return (
    <Box sx={{ mt: 4, px: 2, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        A trip down the memory lane: Your first Watch
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }} color="text.secondary">
        {videoTitle || 'Unknown Title'}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
        Watched on: {formattedTimestamp}
      </Typography>
      <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        <iframe
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    </Box>
  );
};