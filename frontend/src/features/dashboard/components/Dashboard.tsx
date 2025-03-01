import React, { useState, useEffect, useMemo } from 'react';


import { Box, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import { useWebSocketContext } from 'shared/context/WebSocketContext';
import { PeakTimesData, WordCloudData } from 'shared/types/shared.types';
import { TopViewingDaysChart } from './TopViewingDaysChart';
import { PeakTimesGraph } from './PeakTimesGraph';
import { DashboardLayout } from './DashboardLayout';
import { FileUpload } from 'features/upload/components/FileUpload';
import {  MemoryLane } from './MemoryLane';
import { TagCloud } from './TagCloud';
import { Instructions } from './Instructions';

export const Dashboard: React.FC = () => {
  const [peakTimesData, setPeakTimesData] = useState<PeakTimesData | null>(null);
  const [wordCloudData, setWordCloudData] = useState<WordCloudData | null>(null);
  const { lastMessage } = useWebSocketContext();

  useEffect(() => {
    if (lastMessage) {
      console.log('Received WebSocket message:', lastMessage);
      if (lastMessage.type === 'peak_times') {
        setPeakTimesData(lastMessage.data as PeakTimesData);
      } else if (lastMessage.type === 'word_cloud') {
        setWordCloudData(lastMessage.data as WordCloudData);
      }
    }
  }, [lastMessage]);

  // Convert wordCloudData to the format expected by react-d3-cloud (now TagCloud)
  const wordCloudArray = useMemo(() => {
    if (!wordCloudData) return [];
    return Object.entries(wordCloudData).map(([text, value]) => ({
      text,
      value,
    }));
  }, [wordCloudData]);

  const totalVideosWatched = useMemo(() => {
    if (!peakTimesData) return 0;
    return peakTimesData.watch_count.reduce((sum, count) => sum + count, 0);
  }, [peakTimesData]);

  return (
    <DashboardLayout>
      <Instructions/>
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
          <MemoryLane
            firstVideoUrl={peakTimesData.first_video_url}
            firstVideoTitle={peakTimesData.first_video_title}
            firstVideoTimestamp={peakTimesData.first_video_timestamp}
            mostRewatchedUrl={peakTimesData.most_rewatched_url}
            mostRewatchedTitle={peakTimesData.most_rewatched_title}
            mostRewatchedTimestamp={peakTimesData.most_rewatched_timestamp}
            rewatchCount={peakTimesData.rewatch_count}
            favoriteCreatorUrl={peakTimesData.favorite_creator_url}
            favoriteCreatorName={peakTimesData.favorite_creator_name}
            favoriteCreatorWatchCount={peakTimesData.favorite_creator_watch_count}
          />
          {wordCloudData && (
            <TagCloud data={wordCloudArray} />
          )}
        </Box>
      )}
    </DashboardLayout>
  );
};