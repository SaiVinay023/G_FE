import { Close as CloseIcon } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { FC } from 'react';

import { Loader } from 'src/components/Loader';
import { EstimateInfo } from 'src/components/modals/EstimateModal/EstimateInfo';
import { useEstimateID } from 'src/hooks/pages';
import { useRouter } from 'src/i18n/routing';
import { EstimateRes, WorkCard } from 'src/models';

type EstimateModalProps = {
  payload: {
    card: WorkCard;
    assignWorker?: boolean;
  };
  DialogProps: {
    open: boolean;
    [key: string]: unknown;
  };
  handleModalReject?: () => void;
  handleModalResolve: (val?: unknown) => void;
};

export const EstimateModal: FC<EstimateModalProps> = ({
  DialogProps: { onExited, onEntered, ...restDialogProps },
  handleModalReject,
  handleModalResolve,
  payload: { card, assignWorker = false },
}) => {
  const { estimate, loading } = useEstimateID(card.estimateId);
  const t = useTranslations();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  console.log('card', card);
  const openEstimate = (id: string) => {
    handleModalResolve?.();
    router.push(`/estimates/${id}`);
  };

  return (
    <Dialog
      scroll="paper"
      maxWidth="md"
      fullWidth
      keepMounted={restDialogProps.open}
      {...restDialogProps}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          width: '100%',
          borderRadius: '4px',
        },
      }}
    >
      <DialogTitle
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: ['center', 'flex-end'],
          padding: 0,
          px: [1, 2],
          pt: [2, 1],
        }}
      >
        <Typography noWrap component="div" variant="h3" width="95%" textAlign="center">
          {t('CardDrawer.ticket_details')}
        </Typography>

        <IconButton
          onClick={handleModalReject}
          size="small"
          sx={(theme) => ({
            [theme.breakpoints.up('sm')]: {
              mr: theme.spacing(-1),
            },

            [theme.breakpoints.down('sm')]: {
              position: 'absolute',
              top: 0,
              right: 0,
            },
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ position: 'relative', p: 0, px: [1, 2], height: '100%' }}>
        <Loader
          sx={{ mb: 3, minHeight: 150, position: 'absolute' }}
          loading={!loading}
          render={() => (
            <Stack gap={5} height="100%">
              <EstimateInfo
                modalView
                assignWorker={assignWorker}
                card={card}
                estimate={estimate as EstimateRes}
                openEstimate={openEstimate}
              />
            </Stack>
          )}
        />
      </DialogContent>
    </Dialog>
  );
};
