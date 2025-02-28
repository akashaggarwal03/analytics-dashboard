import React, { useState, useEffect, useMemo } from 'react';


import { Box, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import { useWebSocketContext } from 'shared/context/WebSocketContext';
import { PeakTimesData } from 'shared/types/shared.types';
import { TopViewingDaysChart } from './TopViewingDaysChart';
import { PeakTimesGraph } from './PeakTimesGraph';
import { DashboardLayout } from './DashboardLayout';
import { FileUpload } from 'features/upload/components/FileUpload';

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
              component={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Some Groovy Insights into Your YouTube Journey
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}
              component={motion.div}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
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
          </Box>
        )}
      </DashboardLayout>
    );
  };