import { InfoOutlined } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent, CardHeader, Divider, Typography, Box, IconButton } from '@mui/material';
import moment from 'moment/moment';
import { FC, MouseEvent } from 'react';

import { LicensePlate } from 'src/components/LicensePlate';
import { EstimateModal } from 'src/components/modals/EstimateModal';
import { StatusLabel } from 'src/components/StatusLabel';
import { useModal } from 'src/hooks/components/useModal';
import { BuiltInWorkCardStatus, EstimateRes, WorkCard } from 'src/models';
import { formatMoney } from 'src/utils/money';

import { AssigneeSelect } from '../../fields/index';
import { StatusModal } from '../../modals/StatusModal/index';

interface CardProps {
  card: EstimateRes | WorkCard;
  showWorkCard?: boolean;
  onChangeStatus?: (value: BuiltInWorkCardStatus, cardID: string) => void;
}

export const EstimateCard: FC<CardProps> = ({ showWorkCard = false, card, onChangeStatus }) => {
  const modal = useModal();

  const openEstimateModal = () => {
    // @ts-expect-error modal type error
    modal.openModal(EstimateModal, {
      payload: { card },
      fullHeight: true,
    });
  };

  const updateStatusModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    // @ts-expect-error modal type error
    modal.openModal(StatusModal, {
      onModalResolved: (status: BuiltInWorkCardStatus) => {
        onChangeStatus?.(status, card.id);
      },
    });
  };

  const onChangeAssignee = (cardId: string, assigneeId: string) => {
    console.log('card', cardId);
    console.log('assigneeId', assigneeId);
  };

  return (
    <Card
      data-event={JSON.stringify(card)}
      variant="outlined"
      sx={{
        'borderRadius': '12px',
        'boxShadow': 0,
        'width': '100%',
        'minWidth': showWorkCard ? 230 : 250,

        '&:hover': {
          boxShadow: 1,
          cursor: 'pointer',
        },
      }}
      onClick={openEstimateModal}
    >
      <CardHeader
        title={card.title}
        action={
          <IconButton aria-label="info" onClick={openEstimateModal}>
            <InfoOutlined fontSize="small" color="action" />
          </IconButton>
        }
        titleTypographyProps={{
          noWrap: true,
          variant: 'subtitle1',
          fontWeight: 500,
        }}
        subheader={(card as EstimateRes)?.total ? formatMoney((card as EstimateRes)?.total / 100) : undefined}
        subheaderTypographyProps={{
          fontSize: 12,
        }}
        sx={{
          'py': 1,
          'minHeight': 62,

          '.MuiCardHeader-content': {
            maxWidth: '91%',
          },
        }}
      />

      <Divider />

      <CardContent>
        <Box mb={2} display="flex" justifyContent="space-between" gap={2}>
          {card.status && (
            <Box display="flex" alignItems="center" gap={0.25} sx={!onChangeStatus ? { width: '100%' } : {}}>
              <StatusLabel fullWidth={!onChangeStatus} showWorkLabel={showWorkCard} status={card.status} />

              {!!onChangeStatus && (
                <IconButton size="small" onClick={updateStatusModal}>
                  <EditIcon color="primary" fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}
          {(card as EstimateRes)?.creationDate && (
            <Typography fontSize={16}>{moment((card as EstimateRes)?.creationDate).format('MM.DD.YYYY')}</Typography>
          )}
        </Box>

        {(card as EstimateRes)?.customer?.name && (
          <Box
            bgcolor="grey.100"
            borderRadius="4px"
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <Typography fontSize={14} fontWeight={500} color="grey.700">
              {(card as EstimateRes)?.customer?.name}
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="center" mb={2}>
          {(card as EstimateRes)?.vehicle && (
            <LicensePlate
              licensePlateNumber={(card as EstimateRes)?.vehicle?.licensePlateNumber}
              licensePlateNumberCountryCode={(card as EstimateRes)?.vehicle?.licensePlateNumberCountryCode || 'D'}
            />
          )}
        </Box>

        <AssigneeSelect
          cardId={card.id}
          currentAssigneeId={(card as WorkCard).assignee?.id}
          onChangeAssignee={onChangeAssignee}
        />
      </CardContent>
    </Card>
  );
};
