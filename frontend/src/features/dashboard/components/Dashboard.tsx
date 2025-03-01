import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { PeakTimesData } from 'shared/types/shared.types';
import { TopViewingDaysChart } from './TopViewingDaysChart';
import { PeakTimesGraph } from './PeakTimesGraph';
import { DashboardLayout } from './DashboardLayout';
import { FileUpload } from 'features/upload/components/FileUpload';
import { MemoryLane } from './MemoryLane';
import { Datum, TagCloud } from './TagCloud';
import { Instructions } from './Instructions';

export const Dashboard: React.FC = () => {
  const [peakTimesData, setPeakTimesData] = useState<PeakTimesData | null>(null);
  const [wordCloudData, setWordCloudData] = useState<Datum[]>([]);

  const totalVideosWatched = peakTimesData
    ? peakTimesData.watch_count.reduce((sum, count) => sum + count, 0)
    : 0;

  const handleUploadComplete = (peakTimesData: PeakTimesData, wordCloudData: Datum[]) => {
    setPeakTimesData(peakTimesData);
    setWordCloudData(wordCloudData);
  };

  return (
    <DashboardLayout>
      <Instructions />
      <FileUpload onUploadComplete={handleUploadComplete} />
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
          {wordCloudData.length > 0 && (
            <TagCloud data={wordCloudData} />
          )}
        </Box>
      )}
    </DashboardLayout>
  );
};