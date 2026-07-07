import { Table as MuiTable, TableBody, TableCell, TableHead, TableRow, Chip, Box, Typography } from '@mui/material';
import React, { useMemo } from 'react';

import { CannedJob, EstimateServiceGroup, ServiceGroup, EstimateService } from '../../../store/slices/cannedJobsSlice';
import { formatMoney } from '../../../utils/money';

export const useRenderCollapsedRow = () => {
  return useMemo(
    () => (job: CannedJob) => {
      const serviceGroups = job.estimateServiceGroups || job.services || job.serviceGroups || [];

      return (
        <Box sx={{ p: 2 }}>
          {serviceGroups.length > 0 ? (
            <MuiTable size="small" aria-label="service groups">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Man Hours</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceGroups.map((serviceGroup: EstimateServiceGroup | ServiceGroup) =>
                  serviceGroup.estimateServices?.map((service: EstimateService) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <Typography variant="body2">{service.description}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {service.internalId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={service.category || 'No category'}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{service.manHours}h</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatMoney(parseFloat(service.price || '0'))}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {formatMoney(parseFloat(service.total || '0'))}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )),
                )}
              </TableBody>
            </MuiTable>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No services available
            </Typography>
          )}
        </Box>
      );
    },
    [],
  );
};
