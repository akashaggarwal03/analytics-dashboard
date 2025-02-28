import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { PeakTimesData } from '../../../shared/types/shared.types';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface PeakTimesGraphProps {
  data: PeakTimesData;
}

export const PeakTimesGraph: React.FC<PeakTimesGraphProps> = ({ data }) => {
  const years = useMemo(() => [...new Set(data.year)], [data]);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  const chartData = useMemo(() => {
    const hourlyCounts: { [hour: number]: number } = {};
    data.hour.forEach((hour, idx) => {
      if (selectedYear === 'all' || data.year[idx] === selectedYear) {
        hourlyCounts[hour] = (hourlyCounts[hour] || 0) + data.watch_count[idx];
      }
    });

    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: `Peak Watching Times (${selectedYear === 'all' ? 'All Years' : selectedYear})`,
          data: Array(24).fill(0).map((_, hour) => hourlyCounts[hour] || 0),
          borderColor: 'rgba(25, 118, 210, 1)',
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [data, selectedYear]);

  const insight = useMemo(() => {
    const zones = {
      lateNight: { hours: [0, 1, 2, 3, 4, 5], count: 0, label: 'late night hours' },
      morning: { hours: [6, 7, 8, 9, 10, 11], count: 0, label: 'morning' },
      afternoon: { hours: [12, 13, 14, 15, 16, 17, 18], count: 0, label: 'afternoon' },
      night: { hours: [19, 20, 21, 22, 23], count: 0, label: 'night' },
    };

    data.hour.forEach((hour, idx) => {
      const count = data.watch_count[idx];
      const yearMatches = selectedYear === 'all' || data.year[idx] === selectedYear;
      if (yearMatches) {
        if (zones.lateNight.hours.includes(hour)) zones.lateNight.count += count;
        else if (zones.morning.hours.includes(hour)) zones.morning.count += count;
        else if (zones.afternoon.hours.includes(hour)) zones.afternoon.count += count;
        else if (zones.night.hours.includes(hour)) zones.night.count += count;
      }
    });

    const total = Object.values(zones).reduce((sum, zone) => sum + zone.count, 0);
    if (total === 0) return selectedYear === 'all' ? "No watch data available." : `No watch data for ${selectedYear}.`;

    const dominantZone = Object.values(zones).reduce((prev, curr) =>
      curr.count > prev.count ? curr : prev
    );

    return selectedYear === 'all'
      ? `Across all years, you watched YouTube most during the ${dominantZone.label}.`
      : `In ${selectedYear}, you tended to watch YouTube most during the ${dominantZone.label}.`;
  }, [data, selectedYear]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        title: { display: true, text: 'Hour of Day' },
      },
      y: {
        type: 'linear',
        title: { display: true, text: 'Number of Watches' },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: { enabled: true },
      legend: { display: true },
    },
  };

  return (
    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <FormControl sx={{ mb: 2, minWidth: 120 }}>
        <InputLabel>Year</InputLabel>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value as number | 'all')}
          label="Year"
        >
          <MenuItem value="all">All Years</MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography
        variant="body1"
        sx={{ mb: 2, color: 'text.secondary' }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {insight}
      </Typography>
      <Box sx={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </Box>
    </Box>
  );
};