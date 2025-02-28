import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUpload } from 'features/upload/components/FileUpload';
import { useWebSocketContext } from 'shared/context/WebSocketContext';
import { PeakTimesData } from 'shared/types/shared.types';
import { DashboardLayout } from './DashboardLayout';
import { PeakTimesGraph } from './PeakTimesGraph';

export const Dashboard: React.FC = () => {
  const [peakTimesData, setPeakTimesData] = useState<PeakTimesData | null>(null);
  const { lastMessage } = useWebSocketContext();

  React.useEffect(() => {
    if (lastMessage && lastMessage.type === 'peak_times') {
        console.log('Received peak_times:', lastMessage.data);
      setPeakTimesData(lastMessage.data as PeakTimesData);
    }
  }, [lastMessage]);

  return (
    <DashboardLayout>
      <FileUpload />
      {peakTimesData && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <PeakTimesGraph data={peakTimesData} />
        </motion.div>
      )}
    </DashboardLayout>
  );
};