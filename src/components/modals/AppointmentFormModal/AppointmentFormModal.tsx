// src/components/modals/AppointmentFormModal.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import { MuiTelInput, MuiTelInputInfo } from 'mui-tel-input';

import { appointmentSchema, AppointmentFormData } from 'src/schemas/appointmentSchema';
import { useShop } from 'src/hooks/pages/useShop';

// app hooks (Redux slices)
import { useCustomers } from 'src/hooks/pages/useCustomers';
import { useEmployees } from 'src/hooks/pages/useEmployees';

// manual fetch triggers
import { useAppDispatch } from 'src/hooks/store';
import { fetchCustomersAsync } from 'src/store/slices/customersSlice';
import { EmployeesActions } from 'src/store/slices/employeesSlice';

type EmployeeOption = { id: string; name: string };

type CustomerOption = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  licensePlate?: string;
};

interface AppointmentFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData & { shopId: string }) => Promise<void> | void;
  isSubmitting?: boolean;
}

/** Normalize any input to E.164-like "+{country}{number}" (keeps partial while typing). */
const toE164 = (v?: string | null) => {
  if (!v) return '';
  let s = String(v).trim();
  s = s.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, ''); // digits + single leading +
  if (s && !s.startsWith('+')) s = `+${s}`;
  return s;
};

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const dispatch = useAppDispatch();

  // Customers & Employees from slices
  const { customers = [], loading: loadingCustomers } = useCustomers();
  const { employees = [], loading: loadingEmployees } = useEmployees();

  // 🔁 Ensure data is (re)fetched when the modal opens
  useEffect(() => {
    if (!open) return;
    dispatch(fetchCustomersAsync({ user: true, vehicle: true }));
    dispatch(EmployeesActions.fetchEmployeesStart());
  }, [open, dispatch]);

  const employeeOptions: EmployeeOption[] = useMemo(
    () =>
      (employees || []).map((e: any) => {
        const first = e?.user?.firstName?.trim?.() || '';
        const last = e?.user?.lastName?.trim?.() || '';
        const name = `${first} ${last}`.trim() || 'Unknown';
        return { id: String(e?.id), name };
      }),
    [employees]
  );

  const customerOptions: CustomerOption[] = useMemo(() => {
    const seen = new Set<string>();
    const arr = (customers || []).map((c: any) => {
      const first = c?.user?.firstName?.trim?.() || '';
      const last = c?.user?.lastName?.trim?.() || '';
      const name =
        `${first} ${last}`.trim() ||
        c?.name ||
        c?.user?.email ||
        c?.contact?.email ||
        'Unknown';

      const phone =
        c?.contact?.phone ??
        c?.user?.contact?.phone ??
        c?.user?.phone ??
        '';

      const email =
        c?.contact?.email ??
        c?.user?.contact?.email ??
        c?.user?.email ??
        '';

      const licensePlate =
        c?.licensePlate ??
        c?.vehicles?.[0]?.licensePlate ??
        c?.vehicles?.[0]?.licensePlateNumber ??
        c?.vehicles?.[0]?.vehicle?.licensePlateNumber ??
        '';

      return { id: String(c?.id), name, email, phone, licensePlate };
    });

    return arr.filter((o) => {
      if (!o.id || seen.has(o.id)) return false;
      seen.add(o.id);
      return true;
    });
  }, [customers]);

  // Autocomplete state
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null);
  const [acOpen, setAcOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { shop } = useShop();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: '',
      customer: { name: '', phone: '', email: '', licensePlate: '' },
      startTime: new Date(),
      endTime: new Date(Date.now() + 30 * 60 * 1000),
      assignedTo: 'Unassigned',
      comments: '',
    },
  });

  // 30-min minimum gap
  const startTime = watch('startTime');
  const minEndTime = useMemo(
    () => new Date((startTime?.getTime() ?? Date.now()) + 30 * 60 * 1000),
    [startTime]
  );

  // reset on close
  useEffect(() => {
    if (open) return;
    reset({
      title: '',
      customer: { name: '', phone: '', email: '', licensePlate: '' },
      startTime: new Date(),
      endTime: new Date(Date.now() + 30 * 60 * 1000),
      assignedTo: 'Unassigned',
      comments: '',
    });
    setSelectedCustomer(null);
    setInputValue('');
    setAcOpen(false);
  }, [open, reset]);

  // Fill customer fields (no validation while filling)
  const prefillCustomerFields = (c?: CustomerOption | null) => {
    setValue('customer.name', c?.name ?? '', { shouldValidate: false });
    setValue('customer.phone', toE164(c?.phone) ?? '', { shouldValidate: false });
    setValue('customer.email', c?.email ?? '', { shouldValidate: false });
    setValue('customer.licensePlate', c?.licensePlate ?? '', { shouldValidate: false });
  };

  const handleCustomerSelect = (option: CustomerOption | null) => {
    setSelectedCustomer(option);
    if (!option) {
      prefillCustomerFields(null);
      return;
    }
    if (!watch('title')) {
      setValue('title', `Appointment for ${option.name}`, { shouldValidate: false });
    }
    prefillCustomerFields(option);
  };

  const submitForm = async (data: AppointmentFormData) => {
    if (!shop?.id) return;
    await onSubmit({ ...data, shopId: shop.id });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box position="absolute" right={8} top={8}>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Create Appointment
          </Typography>

          {/* Title */}
          <TextField
            fullWidth
            variant="standard"
            placeholder="Add title"
            {...register('title')}
            error={Boolean((isSubmitted || touchedFields.title) && errors.title)}
            helperText={(isSubmitted || touchedFields.title) ? errors.title?.message : ''}
            sx={{ mb: 3 }}
            InputProps={{ disableUnderline: true }}
          />

          {/* Start / End */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="flex" gap={2} sx={{ mb: 3 }}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label="Start Time"
                    onChange={(val) => {
                      if (!val) return;
                      field.onChange(val);
                      const min = new Date(val.getTime() + 30 * 60 * 1000);
                      const currentEnd = (control._formValues as any)?.endTime;
                      if (!currentEnd || new Date(currentEnd) < min) {
                        setValue('endTime', min, { shouldValidate: false });
                      }
                    }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                )}
              />
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label="End Time"
                    minDateTime={minEndTime}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean((isSubmitted || touchedFields.endTime) && errors.endTime),
                        helperText: (isSubmitted || touchedFields.endTime) ? errors.endTime?.message : '',
                      },
                    }}
                    onChange={(val) => {
                      if (!val) return;
                      if (val < minEndTime) {
                        setValue('endTime', minEndTime, { shouldValidate: false });
                        return;
                      }
                      field.onChange(val);
                    }}
                  />
                )}
              />
            </Box>
          </LocalizationProvider>

          {/* Customer picker */}
          <Autocomplete<CustomerOption, false, false, false>
            open={acOpen}
            onOpen={() => setAcOpen(true)}
            onClose={() => setAcOpen(false)}
            options={customerOptions}
            loading={(loadingCustomers || loadingEmployees) && acOpen}
            value={selectedCustomer}
            onChange={(_, value) => handleCustomerSelect(value)}
            inputValue={inputValue}
            onInputChange={(_, v) => setInputValue(v)}
            getOptionLabel={(option) =>
              typeof option === 'string'
                ? option
                : option?.name || option?.email || option?.phone || ''
            }
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            filterOptions={(opts, state) => {
              const q = state.inputValue.trim().toLowerCase();
              if (!q) return opts;
              return opts.filter((o) => {
                const name = o.name?.toLowerCase() || '';
                const email = o.email?.toLowerCase() || '';
                const phone = o.phone?.toLowerCase() || '';
                return name.includes(q) || email.includes(q) || phone.includes(q);
              });
            }}
            noOptionsText={loadingCustomers ? 'Loading...' : 'No customers found'}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box display="flex" flexDirection="column">
                  <Typography variant="body2" fontWeight={600}>{option.name}</Typography>
                  {(option.email || option.phone) && (
                    <Typography variant="caption">
                      {option.email ?? ''}{option.email && option.phone ? ' • ' : ''}{option.phone ?? ''}
                    </Typography>
                  )}
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Customer"
                variant="outlined"
                sx={{ mb: 3 }}
                error={Boolean(errors.customer?.name)}
                helperText={errors.customer?.name?.message}
              />
            )}
            ListboxProps={{ style: { maxHeight: 320, overflow: 'auto' } }}
          />

          {/* Phone & Email */}
          <Box display="flex" gap={2} sx={{ mb: 2 }}>
            <Box flex={1}>
              <Controller
                name="customer.phone"
                control={control}
                render={({ field }) => (
                  <MuiTelInput
                    {...field}
                    label="Phone"
                    fullWidth
                    defaultCountry="US"  // only used if no leading +
                    format="E164"        // show + and no spaces (v3+); harmless on older versions
                    value={toE164(field.value)}
                    onChange={(value: string, _info?: MuiTelInputInfo) => {
                      field.onChange(toE164(value));
                    }}
                    inputMode="tel"
                    error={Boolean(errors.customer?.phone)}
                    helperText={errors.customer?.phone?.message as string | undefined}
                  />
                )}
              />
            </Box>
            <Box flex={1}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                {...register('customer.email')}
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.customer?.email)}
                helperText={errors.customer?.email?.message}
              />
            </Box>
          </Box>

          {/* License Plate & Assigned To */}
          <Box display="flex" gap={2} sx={{ mb: 2 }}>
            <Box flex={1}>
              <TextField
                fullWidth
                label="License Plate"
                variant="outlined"
                {...register('customer.licensePlate')}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box flex={1}>
              <TextField
                fullWidth
                select
                label="Assigned To"
                {...register('assignedTo')}
                defaultValue="Unassigned"
              >
                <MenuItem value="Unassigned">Unassigned</MenuItem>
                {employeeOptions.map((emp) => (
                  <MenuItem key={emp.id} value={emp.name}>
                    {emp.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* Comments */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comments"
            variant="outlined"
            {...register('comments')}
            sx={{ mb: 3 }}
          />

          <Box textAlign="right">
            <Button onClick={onClose} sx={{ mr: 1 }} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>Save</Button>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  );
};
