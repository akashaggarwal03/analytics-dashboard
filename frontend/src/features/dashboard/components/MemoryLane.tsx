import React, { useMemo } from 'react';
import { Box, Grid, Typography, Link } from '@mui/material';

interface MemoryLaneProps {
  // First watched video
  firstVideoUrl?: string;
  firstVideoTitle?: string;
  firstVideoTimestamp?: string;
  // Most rewatched video
  mostRewatchedUrl?: string;
  mostRewatchedTitle?: string;
  mostRewatchedTimestamp?: string;
  rewatchCount?: number;
  // Favorite creator
  favoriteCreatorUrl?: string;
  favoriteCreatorName?: string;
  favoriteCreatorWatchCount?: number;
}

export const MemoryLane: React.FC<MemoryLaneProps> = ({
  firstVideoUrl,
  firstVideoTitle,
  firstVideoTimestamp,
  mostRewatchedUrl,
  mostRewatchedTitle,
  mostRewatchedTimestamp,
  rewatchCount,
  favoriteCreatorUrl,
  favoriteCreatorName,
  favoriteCreatorWatchCount,
}) => {
  // Extract video ID for first video
  const firstVideoId = useMemo(() => {
    if (!firstVideoUrl) return null;
    const match = firstVideoUrl.match(/(?:v=)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }, [firstVideoUrl]);

  // Extract video ID for most rewatched video
  const mostRewatchedVideoId = useMemo(() => {
    if (!mostRewatchedUrl) return null;
    const match = mostRewatchedUrl.match(/(?:v=)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }, [mostRewatchedUrl]);

  // Format timestamps for display
  const firstFormattedTimestamp = useMemo(() => {
    if (!firstVideoTimestamp) return 'Unknown Time';
    const date = new Date(firstVideoTimestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }, [firstVideoTimestamp]);

  const mostRewatchedFormattedTimestamp = useMemo(() => {
    if (!mostRewatchedTimestamp) return 'Unknown Time';
    const date = new Date(mostRewatchedTimestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }, [mostRewatchedTimestamp]);

  return (
    <Box sx={{ mt: 4, px: 2, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        A Trip Down the Memory Lane
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {/* First Watched Video */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            First Watched Video
          </Typography>
          {firstVideoId ? (
            <>
              <Typography variant="body1" sx={{ mb: 1 }} color="text.secondary">
                {firstVideoTitle || 'Unknown Title'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
                Watched on: {firstFormattedTimestamp}
              </Typography>
              <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${firstVideoId}?autoplay=0`}
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
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No first video available.
            </Typography>
          )}
        </Grid>

        {/* Most Rewatched Video */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Most Rewatched Video
          </Typography>
          {mostRewatchedVideoId ? (
            <>
              <Typography variant="body1" sx={{ mb: 1 }} color="text.secondary">
                {mostRewatchedTitle || 'Unknown Title'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                First Watched on: {mostRewatchedFormattedTimestamp}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
                Rewatched {rewatchCount || 0} times
              </Typography>
              <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${mostRewatchedVideoId}?autoplay=0`}
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
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No rewatched videos available.
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Favorite Creator */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Your Favorite Creator
        </Typography>
        {favoriteCreatorName && favoriteCreatorUrl ? (
          <>
            <Typography variant="body1" sx={{ mb: 1 }} color="text.secondary">
              <Link href={favoriteCreatorUrl} target="_blank" rel="noopenernoreferrer" color="primary">
                {favoriteCreatorName}
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Watched {favoriteCreatorWatchCount || 0} videos
            </Typography>
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No favorite creator data available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};