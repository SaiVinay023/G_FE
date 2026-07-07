import { Box, Typography } from '@mui/material';
import React from 'react';

import { SmartTableColumn } from 'src/components/Table';
import { CannedJob } from '../../../store/slices/cannedJobsSlice';
import { formatMoney } from '../../../utils/money';

import { RowMenu } from './RowMenu';

interface UseColumnsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCopy?: (id: string) => void;
}

export const useColumns = ({ onEdit, onDelete, onCopy }: UseColumnsProps = {}): SmartTableColumn<CannedJob>[] => {
  return [
    {
      name: 'description',
      minWidth: 200,
      growCoefficient: 1,
      getValue: (job) => {
        // Handle different data structures safely
        let description = '';
        let totalServices = 0;

        if (job.estimateServiceGroups && job.estimateServiceGroups.length > 0) {
          const firstGroup = job.estimateServiceGroups[0];
          description = firstGroup.description || '';
          totalServices = job.estimateServiceGroups.reduce(
            (acc, group) => acc + (group.estimateServices?.length || 0),
            0,
          );
        } else if (job.serviceGroups && job.serviceGroups.length > 0) {
          // ServiceGroup interface doesn't have description, so we use the job's description
          description = job.description || job.title || '';
          totalServices = job.serviceGroups.reduce((acc, group) => acc + (group.estimateServices?.length || 0), 0);
        } else if (job.services && job.services.length > 0) {
          description = job.description || job.title || '';
          totalServices = job.services.reduce((acc, group) => acc + (group.estimateServices?.length || 0), 0);
        } else {
          description = job.description || job.title || 'No description';
        }

        return (
          <Box component="span" display="flex" flexDirection="column" gap={0.5}>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {description}
            </Typography>
            {totalServices > 1 && (
              <Typography variant="body2" color="text.secondary">
                {totalServices} service{totalServices !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      name: 'createdAt',
      minWidth: 120,
      getValue: (job) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(job.createdAt).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      name: 'total',
      minWidth: 100,
      getValue: (job) => {
        let totalCost = 0;

        if (job.estimateServiceGroups && job.estimateServiceGroups.length > 0) {
          totalCost = job.estimateServiceGroups.reduce(
            (acc, group) =>
              acc +
              (group.estimateServices?.reduce(
                (serviceAcc, service) => serviceAcc + parseFloat(service.total || '0'),
                0,
              ) || 0),
            0,
          );
        } else if (job.serviceGroups && job.serviceGroups.length > 0) {
          totalCost = job.serviceGroups.reduce(
            (acc, group) =>
              acc +
              (group.estimateServices?.reduce(
                (serviceAcc, service) => serviceAcc + parseFloat(service.total || '0'),
                0,
              ) || 0),
            0,
          );
        } else if (job.services && job.services.length > 0) {
          totalCost = job.services.reduce(
            (acc, group) =>
              acc +
              (group.estimateServices?.reduce(
                (serviceAcc, service) => serviceAcc + parseFloat(service.total || '0'),
                0,
              ) || 0),
            0,
          );
        }

        return (
          <Typography variant="subtitle1" fontWeight="bold">
            {formatMoney(totalCost)}
          </Typography>
        );
      },
    },
    {
      name: 'actions',
      minWidth: 70,
      getValue: (job) => <RowMenu id={job.id} onEdit={onEdit} onDelete={onDelete} onCopy={onCopy} />,
    },
  ];
};
