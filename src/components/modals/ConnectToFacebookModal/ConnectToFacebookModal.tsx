import { Close as CloseIcon } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  DialogActions,
  Button,
} from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

type ConnectToFacebookModalProps = {
  DialogProps: {
    open: boolean;
    [key: string]: unknown;
  };
  handleModalReject?: () => void;
  handleModalResolve: (val?: unknown) => void;
};

export const ConnectToFacebookModal: FC<ConnectToFacebookModalProps> = ({
  DialogProps: { onExited, onEntered, ...restDialogProps },
  handleModalReject,
  handleModalResolve,
}) => {
  const t = useTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      scroll="paper"
      maxWidth="sm"
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
          {t('connectToFacebookModal.whatsapp_usage_rules')}
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
        <Box p={2}>
          <Typography variant="body1" color="textSecondary" mb={2}>
            {t('components.text.conversations_can_only_be_initiated_by_your_custom')}
          </Typography>

          <Typography variant="body1" color="textSecondary" mb={2}>
            {t(
              'connectToFacebookModal.the_first_1_000_messages_each_month_are_free_after_that_they_will_cost_0_13_per_message_paid_to_meta_the_owner_of_whatsapp_for_more_information_we_refer_to_the',
            )}{' '}
            <Typography
              component={Link}
              href="https://business.whatsapp.com/products/platform-pricing?country=Netherlands&currency=Euro%20(EUR)&category=Authentication"
              target="_blank"
              color="primary"
            >
              {t('connectToFacebookModal.whatsapp_business_pages')}
            </Typography>
          </Typography>

          <Typography variant="body1" color="textSecondary">
            {t(
              'connectToFacebookModal.in_order_to_enjoy_the_full_potential_of_project_customer_communications_we_highly_recommend_for_you_to_add_a_payment_method_when_requested_during_the_sign_up_process_this_enables_you_to_send_messages_directly_from_project_on_your_own_number',
            )}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" color="primary" onClick={handleModalReject}>
          {t('connectToFacebookModal.connect_later')}
        </Button>

        <Button variant="contained" color="primary" onClick={handleModalResolve}>
          {t('connectToFacebookModal.connect_now')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
