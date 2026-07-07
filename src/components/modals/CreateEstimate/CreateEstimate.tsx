import { Close as CloseIcon } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  DialogActions,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import { useCustomers } from 'src/hooks/pages';
import { useRouter } from 'src/i18n/routing';

import { SearchCustomerForm, SearchResult } from './SearchCustomerForm';
import { useAppDispatch } from '../../../hooks/store/index';
import { EstimatesActions } from '../../../store/slices/estimatesSlice';

type CreateEstimateProps = {
  DialogProps: {
    open: boolean;
    [key: string]: unknown;
  };
  handleModalReject?: () => void;
  handleModalResolve: (val?: unknown) => void;
};

export const CreateEstimate: FC<CreateEstimateProps> = ({
  DialogProps: { onExited, onEntered, ...restDialogProps },
  handleModalReject,
  handleModalResolve,
}) => {
  const t = useTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Use RTK Query hook directly
  const { customers, loading: isLoading, error, updateFilters, resetFilters, filters } = useCustomers();
  const [selectedVehicle, setSelectedVehicle] = useState<SearchResult | null>(null);

  const handleStartEstimate = () => {
    if (selectedVehicle) {
      dispatch(EstimatesActions.resetCurrentEstimate());
      router.push(`/estimates/create/${selectedVehicle.contactPerson}/${selectedVehicle.id}`);
      resetFilters();
      handleModalResolve();
    }
  };

  const handleSelectVehicle = (vehicle: SearchResult) => {
    setSelectedVehicle(vehicle);

    if (vehicle.contactPerson && vehicle.id) {
      router.prefetch(`/estimates/create/${vehicle.contactPerson}/${vehicle.id}`);
    }
  };

  const close = () => {
    handleModalReject?.();
    resetFilters();
  };

  return (
    <Dialog
      scroll="paper"
      maxWidth="sm"
      fullWidth
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
          {t('SelectCustomerVehicleModal.select_a_customer')}
        </Typography>

        <IconButton
          onClick={close}
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

      <DialogContent dividers sx={{ position: 'relative', p: 0, height: '100%' }}>
        <SearchCustomerForm
          customers={customers}
          isLoading={isLoading}
          isError={!!error}
          filters={filters}
          onSelectVehicle={handleSelectVehicle}
          selectedVehicle={selectedVehicle}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" color="primary" onClick={close}>
          {t('shopFormTimeRangeModal.cancelButtonTitle')}
        </Button>

        <Button variant="contained" color="primary" disabled={!selectedVehicle} onClick={handleStartEstimate}>
          {t('SelectCustomerVehicleModal.start_estimate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
