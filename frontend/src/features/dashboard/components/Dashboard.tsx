import React, { useState, useEffect, useMemo } from 'react';


import { Box, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import { useWebSocketContext } from 'shared/context/WebSocketContext';
import { PeakTimesData } from 'shared/types/shared.types';
import { TopViewingDaysChart } from './TopViewingDaysChart';
import { PeakTimesGraph } from './PeakTimesGraph';
import { DashboardLayout } from './DashboardLayout';
import { FileUpload } from 'features/upload/components/FileUpload';
import { FirstVideoPlayer } from './FirstVideoPlayer';

export const Dashboard: React.FC = () => {
  const [peakTimesData, setPeakTimesData] = useState<PeakTimesData | null>(null);
  const { lastMessage } = useWebSocketContext();

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'peak_times') {
      console.log('Received peak_times:', lastMessage.data);
      setPeakTimesData(lastMessage.data as PeakTimesData);
    }
  }, [lastMessage]);

  const totalVideosWatched = useMemo(() => {
    if (!peakTimesData) return 0;
    return peakTimesData.watch_count.reduce((sum, count) => sum + count, 0);
  }, [peakTimesData]);

  return (
    <DashboardLayout>
      <FileUpload />
      {peakTimesData && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h5"
            sx={{ mb: 2, textAlign: 'center', color: 'primary.main' }}
          >
            Some Groovy Insights into Your YouTube Journey
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}
          >
            Total Videos Watched: {totalVideosWatched}
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <PeakTimesGraph data={peakTimesData} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TopViewingDaysChart data={peakTimesData} />
            </Grid>
          </Grid>
          <FirstVideoPlayer
            videoUrl={peakTimesData.first_video_url}
            videoTitle={peakTimesData.first_video_title}
            videoTimestamp={peakTimesData.first_video_timestamp}
          />
        </Box>
      )}
    </DashboardLayout>
  );
};