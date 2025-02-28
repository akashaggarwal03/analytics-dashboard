import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <AppBar
      position="static"
      component={motion.div}
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          YouTube Analytics Dashboard
        </Typography>
        <Typography variant="body2">Welcome, User!</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;