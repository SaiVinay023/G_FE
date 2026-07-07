import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { Dispatch, SetStateAction, useMemo } from 'react';

import type { EstimateRes } from 'src/models';
import { formatMoney } from 'src/utils/money';

interface EstimateReviewProps {
  estimate: EstimateRes;
  confirmPage?: boolean;
  checkedItems?: string[];
  setCheckedItems?: Dispatch<SetStateAction<string[]>>;
}

export const EstimateReview: React.FC<EstimateReviewProps> = ({
  estimate,
  confirmPage = false,
  checkedItems,
  setCheckedItems,
}) => {
  const t = useTranslations();

  const totalVAT = useMemo(
    () => ((estimate.totalBeforeTax / 100) * Number(estimate.taxRate)) / 100,
    [estimate.totalBeforeTax, estimate.taxRate],
  );

  const handleCheckboxChange = (serviceId: string, checked: boolean) => {
    if (!setCheckedItems) return;
    setCheckedItems((prev) => (checked ? [...new Set([...prev, serviceId])] : prev.filter((p) => p !== serviceId)));
  };

  return (
    <Box mt={3}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h4">{estimate.title}</Typography>

        <Typography variant="h4" fontWeight={500}>
          {estimate.kilometers} {t('ReviewEstimate.km')}
        </Typography>
      </Box>

      <Typography sx={{ mt: 2, mb: 3 }}>{estimate.description}</Typography>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{t('createCanned.service')}</TableCell>
              <TableCell>{t('customers.name')}</TableCell>
              <TableCell align="right">{t('createCanned.cost')}</TableCell>
              <TableCell align="right">{t('createCanned.hours')}</TableCell>
              <TableCell align="right">{t('createCanned.total')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {estimate.serviceGroups.map((group) => (
              <React.Fragment key={group.id}>
                <TableRow>
                  <TableCell colSpan={6}>{group.description}</TableCell>
                </TableRow>

                {group.services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Checkbox
                        disabled={!confirmPage}
                        checked={checkedItems?.includes(service.id) || false}
                        onChange={(e) => handleCheckboxChange(service.id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>{service.internalId}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell align="right">{formatMoney(service.price / 100)}</TableCell>
                    <TableCell align="right">{service.manHours}</TableCell>
                    <TableCell align="right">{formatMoney(service.total / 100)}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1} mt={3}>
        <Box display="flex" justifyContent="space-between" width={200}>
          <Typography variant="body2">{t('Single.subTotal')}</Typography>
          <Typography variant="body2">{formatMoney(estimate.totalBeforeTax / 100)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" width={200}>
          <Typography variant="body2">{t('Single.discount')}</Typography>
          <Typography variant="body2">{formatMoney(estimate.discount / 100)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" width={200}>
          <Typography variant="body2">
            {t('ReviewEstimate.vat')} {estimate.taxRate}%
          </Typography>
          <Typography variant="body2">{formatMoney(totalVAT)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" width={200}>
          <Typography variant="body1" fontWeight="bold">
            {t('createCanned.total')}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {formatMoney(estimate.total / 100)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
