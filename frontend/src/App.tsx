import React from 'react';
import { Box } from '@mui/material';
import  Footer  from './shared/components/Footer';
import Header from 'shared/components/Header';
import { Dashboard } from 'features/dashboard/components/Dashboard';
import './index.css';

const App: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Dashboard />
      <Footer />
    </Box>
  );
};

export default App;