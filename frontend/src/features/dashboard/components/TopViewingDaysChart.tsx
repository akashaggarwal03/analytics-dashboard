import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { PeakTimesData } from '../../../shared/types/shared.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TopViewingDaysChartProps {
  data: PeakTimesData;
}

export const TopViewingDaysChart: React.FC<TopViewingDaysChartProps> = ({ data }) => {
  const years = useMemo(() => [...new Set(data.day_of_week_year)], [data]);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  // Step 1: Calculate top 5 days across all years
  const globalTopDays = useMemo(() => {
    const counts: { [day: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    data.day_of_week.forEach((day, idx) => {
      counts[day] += data.day_of_week_count[idx];
    });

    const sortedDays = Object.entries(counts)
      .map(([day, count]) => ({ day: Number(day), count }));

    console.log('Global top 5 days:', sortedDays);
    return sortedDays.map((d) => d.day);
  }, [data]);

  // Step 2: Calculate counts for the selected year, for the top 5 days
  const dayCounts = useMemo(() => {
    const counts: { [day: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    data.day_of_week.forEach((day, idx) => {
      if (selectedYear === 'all' || data.day_of_week_year[idx] === selectedYear) {
        counts[day] += data.day_of_week_count[idx];
      }
    });

    const result = globalTopDays.map((day) => ({
      day,
      count: counts[day],
    }));

    return result;
  }, [data, selectedYear, globalTopDays]);

  const chartData = useMemo(() => {
    const dayNames = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // Adjust for 1-7
    return {
      labels: dayCounts.map((d) => dayNames[d.day]),
      datasets: [
        {
          label: 'Top Viewing Days',
          data: dayCounts.map((d) => d.count),
          backgroundColor: dayCounts.map((d, idx) =>
            idx === 0 ? 'rgba(75, 192, 192, 0.7)' : 'rgba(75, 192, 192, 0.4)'
          ),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          barThickness: 30,
          minBarLength: 1,
        },
      ],
    };
  }, [dayCounts]);

  const hasData = useMemo(() => dayCounts.some((d) => d.count > 0), [dayCounts]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        title: { display: true, text: 'Day of Week' },
      },
      y: {
        type: 'linear',
        title: { display: true, text: 'Watch Count' },
        beginAtZero: true,
        ticks: {
          callback: (value) => (value === 0 ? '' : value),
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return value === 0 ? 'No watches on this day' : `${value} watches`;
          },
        },
      },
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
        Your Favorite Days to Binge
      </Typography>
      <Box sx={{ height: '300px' }}>
        {hasData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
            No watch data available for {selectedYear === 'all' ? 'any year' : selectedYear}.
          </Typography>
        )}
      </Box>
    </Box>
  );
};