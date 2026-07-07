'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface Job {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
}

interface WorkHistoryTabProps {
  workHistory?: Job[];
  expandedSections?: Record<string, boolean>;
  toggleSection?: (section: string) => void;
}

const WorkHistoryTab: React.FC<WorkHistoryTabProps> = ({ workHistory = [] }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Work History</Typography>
      {workHistory.length === 0 ? (
        <Typography>No work history available.</Typography>
      ) : (
        workHistory.map(job => (
          <Paper key={job.id} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">{job.title} at {job.company}</Typography>
              <Typography variant="body2">
                {job.startDate} - {job.endDate || 'Present'}
              </Typography>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default WorkHistoryTab;
