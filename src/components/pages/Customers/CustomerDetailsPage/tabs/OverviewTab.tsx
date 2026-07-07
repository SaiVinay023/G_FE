'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { MuiTelInput } from 'mui-tel-input';
import type { MuiTelInputCountry } from 'mui-tel-input';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useLocale, useTranslations } from 'next-intl';
import { CountryCodeAutocomplete } from 'src/components/fields/CountryCodeAutocomplete';
import { useRouter as useAppRouter } from 'src/i18n/routing';
import { useCustomers } from 'src/hooks/pages/useCustomers';
import { useAppDispatch } from 'src/hooks/store';
import { CustomersActions } from 'src/store/slices/customersSlice';
import { useUser } from 'src/hooks/pages/useUser';

import { getRegionLowerFromPhone, normalizeE164 } from 'src/utils/phoneUtils';
import { CarWidget } from 'src/components/CarWidget/CarWidget';

import type { Customer, Vehicle } from 'src/models';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerCreateSchema } from 'src/schemas/customerSchema';
const customerEditSchema = customerCreateSchema.shape.customer.omit({ authId: true, shopId: true });
type CustomerEditForm = z.infer<typeof customerEditSchema>;

const labelSx = { color: 'text.secondary', fontWeight: 700 as const, fontSize: 14, mb: 0.5 };
const valueSx = { fontSize: 18, lineHeight: 1.35 };
const inputSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 3, minHeight: 56 },
  '& .MuiInputBase-root': { minHeight: 56, borderRadius: 3 },
};
const actionBtnSx = { borderRadius: 2.5, px: 3, py: 1.25, fontWeight: 800 };

const Field: React.FC<{ label: string; value?: React.ReactNode; md?: 6 | 12 }> = ({ label, value, md = 6 }) => (
  <Grid item xs={12} md={md}>
    <Typography sx={labelSx}>{label}</Typography>
    <Typography sx={valueSx}>{value || 'N/A'}</Typography>
  </Grid>
);

type OverviewCustomer = Pick<Customer, 'id' | 'deleted' | 'user' | 'vehicles'>;

type OverviewTabProps =
  | { customer: OverviewCustomer; onAddVehicleClick: () => void; locale?: string }
  | { customerId: string; onAddVehicleClick: () => void; locale?: string };

const DEFAULT_COUNTRY = 'it';

const OverviewTab: React.FC<OverviewTabProps> = (props) => {
  const dispatch = useAppDispatch();
  const { customers } = useCustomers({ skipAutoFetch: true });

  const { updateUser } = useUser();

  const tCustomers = useTranslations('customers');
  const tCreateCustomer = useTranslations('CreateCustomer');
  const tAdded = useTranslations('Added');
  const tSingle = useTranslations('Single');
  const tCommon = useTranslations('common');
  const t = useTranslations();
  const currentLocale = useLocale();
  const router = useAppRouter(); // moved inside component

  const customer: OverviewCustomer | undefined = useMemo(() => {
    if ('customer' in props && props.customer) return props.customer;
    if ('customerId' in props && props.customerId)
      return customers?.find((c) => c.id === props.customerId) as OverviewCustomer | undefined;
    return undefined;
  }, [props, customers]);

  if (!customer) return <Paper variant="outlined" sx={{ p: 3 }}>Loading…</Paper>;

  const user = customer.user ?? {};
  const contact = user.contact ?? {};
  const address = user.address ?? {};
  const vehicles: Vehicle[] = (customer.vehicles ?? []).map((cv: any) => cv.vehicle);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [countryManuallySelected, setCountryManuallySelected] = useState(false);
  const phoneDefaultCountryRef = useRef<string>(DEFAULT_COUNTRY);

  const [formData, setFormData] = useState({
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    phone: normalizeE164(contact.phone ?? ''),
    email: contact.email ?? '',
    addressLine1: address.addressLine1 ?? '',
    addressLine2: address.addressLine2 ?? '',
    zipcode: address.zipcode ?? '',
    city: address.city ?? '',
    country: String(address.country ?? DEFAULT_COUNTRY).toLowerCase(),
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerEditForm>({
    resolver: zodResolver(customerEditSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      contact: { email: formData.email, phone: formData.phone },
      address: {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || null,
        zipcode: formData.zipcode,
        city: formData.city,
        country: formData.country,
      },
    },
  });

  useEffect(() => {
    let detectedCountry = (address.country ? String(address.country) : DEFAULT_COUNTRY).toLowerCase();
    if (contact.phone) {
      const inferred = getRegionLowerFromPhone(contact.phone);
      if (inferred) detectedCountry = inferred;
    }

    phoneDefaultCountryRef.current = detectedCountry;

    const next = {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: normalizeE164(contact.phone ?? ''),
      email: contact.email ?? '',
      addressLine1: address.addressLine1 ?? '',
      addressLine2: address.addressLine2 ?? '',
      zipcode: address.zipcode ?? '',
      city: address.city ?? '',
      country: detectedCountry,
    };

    setFormData(next);
    setCountryManuallySelected(false);

    reset({
      firstName: next.firstName,
      lastName: next.lastName,
      contact: { email: next.email, phone: next.phone },
      address: {
        addressLine1: next.addressLine1,
        addressLine2: next.addressLine2 || null,
        zipcode: next.zipcode,
        city: next.city,
        country: next.country,
      },
    });
  }, [
    customer,
    contact.phone,
    address.country,
    address.addressLine1,
    address.addressLine2,
    address.zipcode,
    address.city,
    user.firstName,
    user.lastName,
    reset,
  ]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (name === 'firstName') setValue('firstName', value, { shouldValidate: true, shouldDirty: true });
    if (name === 'lastName') setValue('lastName', value, { shouldValidate: true, shouldDirty: true });
    if (name === 'email') setValue('contact.email', value, { shouldValidate: true, shouldDirty: true });
    if (name === 'addressLine1') setValue('address.addressLine1', value, { shouldValidate: true, shouldDirty: true });
    if (name === 'addressLine2') setValue('address.addressLine2', value || null, { shouldValidate: true, shouldDirty: true });
    if (name === 'zipcode') setValue('address.zipcode', value, { shouldValidate: true, shouldDirty: true });
    if (name === 'city') setValue('address.city', value, { shouldValidate: true, shouldDirty: true });
  };

  const onPhoneChange = (val: string, info?: { countryCode?: MuiTelInputCountry }) => {
    const normalized = normalizeE164(val);

    setFormData((prev) => ({ ...prev, phone: normalized }));
    setValue('contact.phone', normalized, { shouldValidate: true, shouldDirty: true });

    const iso2FromFlag = info?.countryCode?.toLowerCase();

    if (iso2FromFlag) {
      setCountryManuallySelected(true);
      setFormData((p) => ({ ...p, country: iso2FromFlag }));
      setValue('address.country', iso2FromFlag, { shouldValidate: true, shouldDirty: true });
      phoneDefaultCountryRef.current = iso2FromFlag;
      return;
    }

    if (!countryManuallySelected) {
      const inferred = getRegionLowerFromPhone(normalized);
      if (inferred) {
        setFormData((p) => ({ ...p, country: inferred }));
        setValue('address.country', inferred, { shouldValidate: true, shouldDirty: true });
        phoneDefaultCountryRef.current = inferred;
      }
    }
  };

  const onCountryChange = (val: string | null) => {
    setCountryManuallySelected(true);
    const nextCountry = (val || formData.country || DEFAULT_COUNTRY).toLowerCase();
    setFormData((p) => ({ ...p, country: nextCountry }));
    setValue('address.country', nextCountry, { shouldValidate: true, shouldDirty: true });
  };

  // ✅ Single validated submit (kept)
  const onValidSubmit = async (values: CustomerEditForm) => {
    try {
      setSaving(true);
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        contact: {
          phone: normalizeE164(values.contact.phone),
          email: values.contact.email,
        },
        address: {
          addressLine1: values.address.addressLine1,
          addressLine2: values.address.addressLine2 || undefined,
          zipcode: values.address.zipcode,
          city: values.address.city,
          country: (values.address.country || DEFAULT_COUNTRY).toUpperCase(),
        },
      };

      dispatch(CustomersActions.updateCustomerUser({ customerId: customer.id, user: payload }));
      if (user?.id) {
        await updateUser(user.id, payload);
      }

      // keep the read-only view in sync instantly
      setFormData((prev) => ({
        ...prev,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: normalizeE164(values.contact.phone),
        email: values.contact.email,
        addressLine1: values.address.addressLine1,
        addressLine2: values.address.addressLine2 || '',
        zipcode: values.address.zipcode,
        city: values.address.city,
        country: (values.address.country || DEFAULT_COUNTRY).toLowerCase(),
      }));

      toast.success(tCustomers('customerUpdated'));
      setIsEditing(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || tCommon('error'));
      dispatch(CustomersActions.rollbackCustomer(customer.id));
    } finally {
      setSaving(false);
    }
  };

  const err = (pathErr?: { message?: string }) => (pathErr?.message ? t(pathErr.message as any) : undefined);

  const onDelete = async () => {
    if (!confirm(tCommon('confirmDelete') ?? 'Are you sure?')) return;
    try {
      setDeleting(true);
      toast.success(tCustomers('customerUpdated'));
    } catch (e: any) {
      toast.error(e?.message || tCommon('error'));
    } finally {
      setDeleting(false);
    }
  };

  const resetFromStore = () => {
    const next = {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: normalizeE164(contact.phone ?? ''),
      email: contact.email ?? '',
      addressLine1: address.addressLine1 ?? '',
      addressLine2: address.addressLine2 ?? '',
      zipcode: address.zipcode ?? '',
      city: address.city ?? '',
      country: String(address.country ?? DEFAULT_COUNTRY).toLowerCase(),
    };
    setFormData(next);
    reset({
      firstName: next.firstName,
      lastName: next.lastName,
      contact: { email: next.email, phone: next.phone },
      address: {
        addressLine1: next.addressLine1,
        addressLine2: next.addressLine2 || null,
        zipcode: next.zipcode,
        city: next.city,
        country: next.country,
      },
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'stretch' }}>
          <Box sx={{ flex: '1 1 0', minWidth: 0, pr: { md: 2 } }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
              {tCustomers('customerDetails')}
            </Typography>

            {!isEditing ? (
              <>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field
                      label={tCustomers('name')}
                      value={`${(formData.firstName || user.firstName || '')} ${(formData.lastName || user.lastName || '')}`}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field
                      label={tCreateCustomer('phone')}
                      value={formData.phone || contact.phone}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 12 }}>
                    <Field
                      label={tCreateCustomer('email')}
                      value={formData.email || contact.email}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 12 }}>
                    <Field label={tCreateCustomer('addressLine1')} value={formData.addressLine1} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 12 }}>
                    <Field label={tCreateCustomer('addressLine2')} value={formData.addressLine2} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field label={tCreateCustomer('zipcode')} value={formData.zipcode} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field label={tCreateCustomer('city')} value={formData.city} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <Field label={tCreateCustomer('country')} value={formData.country} />
                  </Grid>
                </Grid>
                <Box mt={1}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(true)}
                    sx={{ ...actionBtnSx, borderWidth: 2, borderColor: 'primary.main', color: 'primary.main' }}
                  >
                    {tSingle('edit')}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                      label={tCreateCustomer('firstName')}
                      name="firstName"
                      value={formData.firstName}
                      onChange={onChange}
                      fullWidth
                      size="medium"
                      sx={inputSx}
                      error={!!errors.firstName}
                      helperText={err(errors.firstName)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                      label={tCreateCustomer('lastName')}
                      name="lastName"
                      value={formData.lastName}
                      onChange={onChange}
                      fullWidth
                      size="medium"
                      sx={inputSx}
                      error={!!errors.lastName}
                      helperText={err(errors.lastName)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 12 }}>
                    <MuiTelInput
                      label={tCreateCustomer('phone')}
                      value={formData.phone}
                      onChange={onPhoneChange}
                      defaultCountry={(phoneDefaultCountryRef.current || DEFAULT_COUNTRY).toUpperCase() as any}
                      forceCallingCode
                      fullWidth
                      size="medium"
                      sx={inputSx}
                      error={!!errors.contact?.phone}
                      helperText={err(errors.contact?.phone)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 12 }}>
                    <TextField
                      label={tCreateCustomer('email')}
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      fullWidth
                      size="medium"
                      sx={inputSx}
                      error={!!errors.contact?.email}
                      helperText={err(errors.contact?.email)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 12 }}>
                    <TextField
                      label={tCreateCustomer('addressLine1')}
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={onChange}
                      fullWidth
                      size="medium"
                      sx={inputSx}
                      error={!!errors.address?.addressLine1}
                      helperText={err(errors.address?.addressLine1)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 12 }}>
                    <TextField
                      label={tCreateCustomer('addressLine2')}
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={onChange}
                      fullWidth
                      size="medium"
                      sx={inputSx}
                      error={!!errors.address?.addressLine2}
                      helperText={err(errors.address?.addressLine2)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                      label={tCreateCustomer('zipcode')}
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={onChange}
                      fullWidth
                      size="medium"
                      sx={inputSx}
                      error={!!errors.address?.zipcode}
                      helperText={err(errors.address?.zipcode)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <TextField
                      label={tCreateCustomer('city')}
                      name="city"
                      value={formData.city}
                      onChange={onChange}
                      fullWidth
                      size="medium"
                      sx={inputSx}
                      error={!!errors.address?.city}
                      helperText={err(errors.address?.city)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    <CountryCodeAutocomplete
                      value={formData.country}
                      onChange={(val) => {
                        setCountryManuallySelected(true);
                        const next = (val || formData.country || DEFAULT_COUNTRY).toLowerCase();
                        setFormData((p) => ({ ...p, country: next }));
                        setValue('address.country', next, { shouldValidate: true, shouldDirty: true });
                      }}
                      label={tCreateCustomer('country')}
                      fullWidth
                      error={err(errors.address?.country)}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  {/* cancel resets local data from store */}
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false);
                      resetFromStore();
                    }}
                    sx={actionBtnSx}
                  >
                    {tAdded('cancel')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={onDelete}
                    disabled={deleting}
                    sx={actionBtnSx}
                  >
                    {deleting ? tAdded('deleting') : tSingle('delete')}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit(onValidSubmit)}
                    disabled={saving}
                    sx={actionBtnSx}
                  >
                    {saving ? tCommon('saving') : tCommon('saveChanges')}
                  </Button>
                </Box>
              </>
            )}
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1 }} />

          <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
              <Typography variant="h6" fontWeight={800}>
                {tCustomers('garage')}: {vehicles.length} {tAdded('vehicles')}
              </Typography>
              <IconButton
                aria-label={tAdded('addVehicle')}
                onClick={props.onAddVehicleClick}
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            {vehicles.length ? (
              vehicles.map((v) => (
                <CarWidget
                  key={v.id}
                  vehicle={v as any}
                  disableMenu
                />
              ))
            ) : (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Typography>{tCustomers('noVehicles')}</Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default OverviewTab;
