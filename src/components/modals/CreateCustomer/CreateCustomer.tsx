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
  Box,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { FC, useState, useCallback, useEffect, useRef } from 'react';
import { useCustomers } from 'src/hooks/pages/useCustomers';
import { useVehicles } from 'src/hooks/pages/useVehicles';
import { CreateVehicleRequest } from 'src/models/vehicle';
import { CreateCustomerRequest, Customer, UserRole } from 'src/models';
import { CreateCustomerForm, type CustomerFormData } from './CreateCustomerForm';
import { AddVehicleForm, type VehicleFormData } from './AddVehicleForm';

type CreateCustomerModalProps = {
  DialogProps: {
    open: boolean;
    onClose?: () => void;
    [key: string]: unknown;
  };
  handleModalReject?: () => void;
  handleModalResolve: (val?: unknown) => void;
};

const STEPS = ['Contact Info', 'Vehicle Info'];

export const CreateCustomer: FC<CreateCustomerModalProps> = ({
  DialogProps: { onClose, ...restDialogProps },
  handleModalReject,
  handleModalResolve,
}) => {
  const t = useTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [optimisticCustomerId, setOptimisticCustomerId] = useState<string | null>(null);

  const dialogOpenedRef = useRef(false);
  const prevOpenRef = useRef(restDialogProps.open);

  const {
    creating: customerCreating,
    createError: customerError,
    createdCustomer,
    createCustomer,
    addCustomer,
    removeOptimisticCustomer,
    addVehicleToCustomer,
    clearCreateError,
    clearCreatedCustomer,
    resetCreateState,
    errorCleared,
  } = useCustomers({ skipAutoFetch: true });

  const {
    creating: vehicleCreating,
    createError: vehicleError,
    createdVehicle,
    createVehicle,
    clearCreateError: clearVehicleError,
    clearCreatedVehicle,
  } = useVehicles();

  useEffect(() => {
    if (restDialogProps.open && !prevOpenRef.current) {
      dialogOpenedRef.current = true;
      if (!customerError && !vehicleError) {
        resetCreateState();
      }
    } else if (!restDialogProps.open && prevOpenRef.current) {
      dialogOpenedRef.current = false;
      resetCreateState();
      setOptimisticCustomerId(null);
    }
    prevOpenRef.current = restDialogProps.open;
  }, [restDialogProps.open, customerError, vehicleError, resetCreateState]);

  useEffect(() => {
    if (dialogOpenedRef.current && !customerError && !vehicleError && errorCleared) {
      resetCreateState();
      dialogOpenedRef.current = false;
    }
  }, [customerError, vehicleError, errorCleared, resetCreateState]);

  const createOptimisticCustomer = useCallback((customerData: CreateCustomerRequest, customerId: string): Customer => {
    return {
      id: customerId,
      shopId: '',
      userId: '',
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: '',
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        contact: {
          email: customerData.contact.email,
          phone: customerData.contact.phone,
        },
        address: {
          ...customerData.address,
          addressLine2: customerData.address.addressLine2 ?? null,
        },
        role: {
          name: customerData.role.name as UserRole,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authId: '',
      },
      vehicles: [],
    };
  }, []);

  const handleCustomerSubmit = useCallback(
    async (data: CreateCustomerRequest): Promise<void> => {
      const tempId = `temp-${Date.now()}`;
      setOptimisticCustomerId(tempId);

      try {
        const optimisticCustomer = createOptimisticCustomer(data, tempId);
        addCustomer(optimisticCustomer);

        const result = await createCustomer(data);

        if (result?.id) {
          const actualCustomer = createOptimisticCustomer(data, result.id);
          addCustomer(actualCustomer, tempId);
          setOptimisticCustomerId(result.id);
        }
      } catch (error) {
        removeOptimisticCustomer(tempId);
        setOptimisticCustomerId(null);
        console.error('Customer creation failed:', error);
        throw error;
      }
    },
    [createCustomer, createOptimisticCustomer, addCustomer, removeOptimisticCustomer],
  );

  useEffect(() => {
    if (!customerCreating && !customerError && createdCustomer && activeStep === 0) {
      setActiveStep(1);
      setIsFormValid(false);
    }
  }, [customerCreating, customerError, createdCustomer, activeStep]);

  const handleVehicleSubmit = useCallback(
    async (data: VehicleFormData) => {
      const actualCustomerId = createdCustomer?.id || optimisticCustomerId;

      if (!actualCustomerId) {
        console.error('No customer ID available for vehicle creation');
        return;
      }

      try {
        const vehicleRequest: CreateVehicleRequest = {
          make: data.make,
          model: data.model,
          generation: data.generation,
          type: data.type,
          vin: data.vin ?? '',
          licensePlateNumber: data.licensePlateNumber,
          licensePlateNumberCountryCode: data.licenseCountry,
          kba: data.kba ?? '',
          customerId: actualCustomerId,
        };

        const optimisticVehicle = {
          id: `temp-vehicle-${Date.now()}`,
          contactPerson: '',
          vin: vehicleRequest.vin,
          licensePlateNumber: vehicleRequest.licensePlateNumber,
          licensePlateNumberCountryCode: vehicleRequest.licensePlateNumberCountryCode,
          kba: vehicleRequest.kba,
          make: vehicleRequest.make,
          model: vehicleRequest.model,
          generation: vehicleRequest.generation,
          type: vehicleRequest.type,
          image: '',
        };

        addVehicleToCustomer(actualCustomerId, optimisticVehicle);

        const result = await createVehicle(vehicleRequest);

        if (result?.id) {
          const actualVehicle = {
            ...optimisticVehicle,
            id: result.id,
          };
          addVehicleToCustomer(actualCustomerId, actualVehicle);
        }
      } catch (error) {
        console.error('Failed to add vehicle:', error);
      }
    },
    [createdCustomer?.id, optimisticCustomerId, createVehicle, addVehicleToCustomer],
  );

  const handleClose = useCallback(() => {
    if (optimisticCustomerId && optimisticCustomerId.startsWith('temp-')) {
      removeOptimisticCustomer(optimisticCustomerId);
    }
    handleModalReject?.();
    onClose?.();
    setActiveStep(0);
    setIsFormValid(false);
    setOptimisticCustomerId(null);
    resetCreateState();
    clearVehicleError();
    clearCreatedVehicle();
  }, [
    optimisticCustomerId,
    removeOptimisticCustomer,
    handleModalReject,
    onClose,
    resetCreateState,
    clearVehicleError,
    clearCreatedVehicle,
  ]);

  useEffect(() => {
    if (!vehicleCreating && !vehicleError && createdVehicle && activeStep === 1) {
      handleModalResolve({
        customerId: createdCustomer?.id || optimisticCustomerId,
        vehicleId: createdVehicle.id,
      });
      handleClose();
    }
  }, [
    vehicleCreating,
    vehicleError,
    createdVehicle,
    activeStep,
    createdCustomer?.id,
    optimisticCustomerId,
    handleModalResolve,
    handleClose,
  ]);

  const handleNext = useCallback(async () => {
    const formElement = document.getElementById('customer-form');
    if (formElement && (formElement as any).validateForm && (formElement as any).submitForm) {
      const isValid = await (formElement as any).validateForm();
      if (isValid) {
        (formElement as any).submitForm();
      }
    }
  }, []);

  const handleSubmitVehicle = useCallback(async () => {
    const formElement = document.getElementById('vehicle-form');
    if (formElement && (formElement as any).validateForm && (formElement as any).submitForm) {
      const isValid = await (formElement as any).validateForm();
      if (isValid) {
        (formElement as any).submitForm();
      }
    }
  }, []);

  const handleSkipVehicle = useCallback(() => {
    handleModalResolve({ customerId: createdCustomer?.id || optimisticCustomerId });
    handleClose();
  }, [createdCustomer?.id, optimisticCustomerId, handleModalResolve, handleClose]);

  const renderStepContent = useCallback(() => {
    switch (activeStep) {
      case 0:
        return (
          <CreateCustomerForm
            onSubmit={handleCustomerSubmit}
            onValidationChange={setIsFormValid}
            isSubmitting={customerCreating}
            error={customerError}
            onErrorClear={clearCreateError}
          />
        );
      case 1:
        return (
          <AddVehicleForm
            customerId={createdCustomer?.id || optimisticCustomerId || ''}
            onSubmit={handleVehicleSubmit}
            onValidationChange={setIsFormValid}
            isSubmitting={vehicleCreating}
            error={vehicleError}
            onErrorClear={clearVehicleError}
          />
        );
      default:
        return null;
    }
  }, [
    activeStep,
    handleCustomerSubmit,
    handleVehicleSubmit,
    customerCreating,
    createdCustomer?.id,
    optimisticCustomerId,
    vehicleCreating,
    customerError,
    vehicleError,
    clearCreateError,
    clearVehicleError,
  ]);

  return (
    <Dialog
      scroll="paper"
      maxWidth="md"
      fullWidth
      {...restDialogProps}
      fullScreen={isMobile}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: '100%',
          borderRadius: 1,
          maxHeight: isMobile ? '100%' : 'calc(100% - 64px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          pt: 2,
        }}
      >
        <Typography variant="h4" component="span" textAlign="center">
          {t('CreateCustomer.title')}
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ px: 2, py: 1 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{t(`CreateCustomer.steps.${label.toLowerCase().replace(' ', '')}`)}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {activeStep === 0 ? (
          <Button variant="contained" onClick={handleNext} disabled={!isFormValid || customerCreating}>
            {customerCreating ? t('common.creating') : t('common.next')}
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={handleSkipVehicle} disabled={vehicleCreating}>
              {t('common.skip')}
            </Button>
            <Button variant="contained" onClick={handleSubmitVehicle} disabled={!isFormValid || vehicleCreating}>
              {vehicleCreating ? t('common.saving') : t('CreateCustomer.addVehicle')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
