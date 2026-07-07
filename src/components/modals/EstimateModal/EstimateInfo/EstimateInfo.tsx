import { Box, Typography, Button, Grid, Divider } from '@mui/material';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import React, { FC, useMemo } from 'react';

import { CarWidget } from 'src/components/CarWidget';
import { CustomerSnippet } from 'src/components/CustomerSnippet';
import { EstimateMenu } from 'src/components/Estimates/EstimateMenu/EstimateMenu';
import { EstimateReview } from 'src/components/Estimates/EstimateReview/EstimateReview';
import { AssigneeSelect } from 'src/components/fields';
import { StatusLabel } from 'src/components/StatusLabel';
import { CalendarEvent, WorkCard, EstimateRes } from 'src/models';

interface CardDrawerProps {
  estimate: EstimateRes;
  card?: WorkCard;
  assignWorker?: boolean;
  modalView?: boolean;
  onChange?: () => void;
  cancelEstimate?: (card: CalendarEvent['cardData']) => void;
  openEstimate?: (id: string) => void;
}

export const EstimateInfo: FC<CardDrawerProps> = ({
  modalView = false,
  assignWorker = false,
  card,
  estimate,
  openEstimate,
}) => {
  const t = useTranslations();

  const checkedEstimate = useMemo(
    () =>
      estimate?.serviceGroups.flatMap((service) =>
        service.services.filter((serviceItem) => serviceItem.checked).map((e) => e.id),
      ),
    [estimate?.serviceGroups],
  );

  const onChangeAssignee = (cardId: string, assigneeId: string) => {
    console.log('card', cardId);
    console.log('assigneeId', assigneeId);
  };

  return (
    <>
      <Box sx={{ p: [1, 2, 2] }}>
        <Grid container spacing={3}>
          {modalView && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6">{estimate?.title}</Typography>
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <StatusLabel size="medium" status={estimate?.status} />
                <EstimateMenu estimate={estimate} />
              </Grid>
            </>
          )}

          {!!estimate?.customer && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomerSnippet customer={estimate?.customer} />
            </Grid>
          )}

          {!!estimate?.vehicle && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <CarWidget disableMenu={!modalView} vehicle={estimate?.vehicle} />
            </Grid>
          )}

          {!modalView && (
            <>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Typography variant="h4">{t('Estimates.title')}</Typography>

                  <Typography>#{estimate.id.slice(-6)}</Typography>
                </Box>

                <Typography variant="h4" fontWeight={400}>
                  {moment().format('DD MMMM YYYY')}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{ justifyContent: { xs: 'space-between', sm: 'flex-end' } }}
                >
                  <StatusLabel size="medium" status={estimate?.status} />
                  <EstimateMenu estimate={estimate} />
                </Box>
              </Grid>
            </>
          )}

          {!!card && (
            <>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Drop-Off
                </Typography>

                <Typography>{card?.dropOffDate ? moment(card.dropOffDate).format('MMMM DD, YYYY') : '—'}</Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Pick-Up
                </Typography>

                <Typography>{card?.pickUpDate ? moment(card.pickUpDate).format('MMMM DD, YYYY') : '—'}</Typography>
              </Grid>
            </>
          )}

          {!!card && assignWorker && (
            <Grid size={{ xs: 12 }}>
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography gutterBottom variant="subtitle2" color="textSecondary">
                  Assignee
                </Typography>

                <AssigneeSelect
                  cardId={card?.id}
                  currentAssigneeId={(card as WorkCard).assignee?.id}
                  onChangeAssignee={onChangeAssignee}
                />
              </Box>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <EstimateReview estimate={estimate} checkedItems={checkedEstimate} />
          </Grid>
        </Grid>
      </Box>

      {openEstimate && (
        <Box sx={{ padding: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => openEstimate?.(estimate.id)} fullWidth>
            View Estimate
          </Button>
        </Box>
      )}
    </>
  );
};
