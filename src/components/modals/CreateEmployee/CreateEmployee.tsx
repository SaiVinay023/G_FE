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
  Alert,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { FC, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Form } from 'src/components/modals/CreateEmployee/Form';
import { useEmployees } from 'src/hooks/pages/useEmployees';
import { employeeCreateSchema, EmployeeCreateFormData } from 'src/schemas/employeeSchema';

type CreateEmployeeModalProps = {
  DialogProps: {
    open: boolean;
    [key: string]: unknown;
  };
  handleModalReject?: () => void;
  handleModalResolve: (val?: unknown) => void;
};

export const CreateEmployee: FC<CreateEmployeeModalProps> = ({
  DialogProps: { onExited, onEntered, ...restDialogProps },
  handleModalReject,
  handleModalResolve,
}) => {
  const t = useTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { createEmployee, creating, createError, clearCreateError } = useEmployees();
  const wasCreatingRef = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<EmployeeCreateFormData>({
    resolver: zodResolver(employeeCreateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      repeatPassword: '',
      addressLine1: '',
      addressLine2: '',
      zipcode: '',
      city: '',
      country: '',
    },
    mode: 'onTouched',
  });

  const hasErrors = Object.keys(errors).length > 0;

  // Track creating state changes
  useEffect(() => {
    if (creating) {
      wasCreatingRef.current = true;
    }
  }, [creating]);

  // Clear errors when modal opens
  useEffect(() => {
    if (restDialogProps.open) {
      clearCreateError();
      wasCreatingRef.current = false;
    }
  }, [restDialogProps.open, clearCreateError]);

  // Handle successful creation
  useEffect(() => {
    if (wasCreatingRef.current && !creating && !createError) {
      toast.success(t('EmployeeCreateForm.success'));
      handleModalResolve();
      reset();
      wasCreatingRef.current = false;
    }
  }, [creating, createError, handleModalResolve, reset, t]);

  const onSubmit = useCallback(
    async (data: EmployeeCreateFormData) => {
      try {
        console.log('Form submitted with data:', data);
        await createEmployee(data);
      } catch (error) {
        console.error('Failed to create employee:', error);
      }
    },
    [createEmployee],
  );

  const handleCancel = useCallback(() => {
    clearCreateError();
    reset();
    wasCreatingRef.current = false;
    handleModalReject?.();
  }, [clearCreateError, reset, handleModalReject]);

  const handleFormSubmit = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  // Debug logging
  console.log('Form Debug Info:', {
    isDirty,
    isValid,
    hasErrors,
    errors,
    creating,
    isSubmitting,
    errorCount: Object.keys(errors).length,
  });

  return (
    <Dialog
      scroll="paper"
      maxWidth="md"
      fullWidth
      {...restDialogProps}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          width: '100%',
          borderRadius: '4px',
          maxHeight: '90vh',
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
          {t('Users.addEmployee')}
        </Typography>

        <IconButton
          onClick={handleCancel}
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
        {createError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearCreateError}>
            {createError}
          </Alert>
        )}

        <Form control={control} errors={errors} watch={watch} />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" color="primary" onClick={handleCancel} disabled={creating}>
          {t('shopFormTimeRangeModal.cancelButtonTitle')}
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleFormSubmit}
          disabled={creating || isSubmitting || hasErrors}
          sx={{ minWidth: 120 }}
        >
          {creating || isSubmitting ? t('EmployeeCreateForm.creating') : t('EmployeeCreateForm.submitButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
