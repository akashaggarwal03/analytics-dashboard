import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <Box
      component={motion.footer}
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ py: 2, textAlign: 'center', bgcolor: 'grey.900' }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2025 YouTube Analytics Dashboard | Built by Akash Aggarwal
      </Typography>
    </Box>
  );
};

export default Footer;