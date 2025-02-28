import React, { useRef } from 'react';
import { Button, Box, Input } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_URL = 'http://127.0.0.1:8000/dashboard/upload-generate-dashboard';

interface FileUploadProps {
  onUploadStart?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadStart }) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const watchRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.current?.files || !watchRef.current?.files) return;

    const formData = new FormData();
    formData.append('search_history', searchRef.current.files[0]);
    formData.append('watch_history', watchRef.current.files[0]);

    try {
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadStart?.();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <Box
      component={motion.form}
      onSubmit={handleSubmit}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      sx={{ mb: 4 }}
    >
      <Input inputRef={searchRef} type="file" sx={{ mb: 2 }} />
      <Input inputRef={watchRef} type="file" sx={{ mb: 2 }} />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        component={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Generate My Dashboard
      </Button>
    </Box>
  );
};