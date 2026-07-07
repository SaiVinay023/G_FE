'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import {
  Box, Tab, Tabs, Typography, Paper, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, Button,
} from '@mui/material';

import { AddVehicleForm, VehicleFormData } from 'src/components/modals/CreateCustomer/AddVehicleForm';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'src/i18n/routing';

import { useCustomers } from 'src/hooks/pages/useCustomers';
import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { CustomersActions } from 'src/store/slices/customersSlice';
import { VehicleActions } from 'src/store/slices/vehicleSlice';
import { useVehicles } from 'src/hooks/pages/useVehicles';


const OverviewTab = dynamic(() => import('./tabs/OverviewTab'), { ssr: false, loading: () => <Typography>Loading…</Typography> });
const WorkHistoryTab = dynamic(() => import('./tabs/WorkHistoryTab'), { ssr: false, loading: () => <Typography>Loading…</Typography> });
const EstimatesTab = dynamic(() => import('./tabs/EstimatesTab'), { ssr: false, loading: () => <Typography>Loading…</Typography> });
const CommunicationsTab = dynamic(() => import('./tabs/CommunicationsTab'), { ssr: false, loading: () => <Typography>Loading…</Typography> });

type TabKey = 'overview' | 'workHistory' | 'estimates' | 'communications';

type Props = {
  id: string;
};

function coercePlateCountry(input: any, fallback: string = 'IT'): string {
  if (!input) return fallback.toUpperCase();
  if (typeof input === 'string') return input.slice(0, 2).toUpperCase();
  if (typeof input === 'object') {
    if ('code' in input) return String(input.code).slice(0, 2).toUpperCase();
    if ('value' in input) return String((input as any).value).slice(0, 2).toUpperCase();
    if ('alpha2' in input) return String((input as any).alpha2).slice(0, 2).toUpperCase();
  }
  return fallback.toUpperCase();
}

export function CustomerDetailsPage({ id }: Props) {
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const tCustomers = useTranslations('customers');
  const tAdded = useTranslations('Added');
  const tEstimates = useTranslations('Estimates');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { customers, loading, error } = useCustomers({ skipAutoFetch: false });
  const { createVehicle } = useVehicles();

  const { creating, createError } = useAppSelector((s) => s.vehicles);

  const handleClearCreateError = () => {
    dispatch(VehicleActions.clearCreateError());
  };

  const customer = useMemo(() => customers?.find((c) => c.id === id), [customers, id]);

  const initialTab = (searchParams.get('tab') as TabKey) || 'overview';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    if (urlSearchParams.get('tab') !== activeTab) {
      urlSearchParams.set('tab', activeTab);
      router.replace(`${pathname}?${urlSearchParams.toString()}`);
    }
  }, [activeTab, pathname]);

  const handleTabChange = (_: React.SyntheticEvent, v: TabKey) => setActiveTab(v);

  const handleAddVehicleSubmit = async (data: VehicleFormData) => {
    if (!customer) return;
    const tempId = `temp-${Date.now()}`;

    const optimisticVehicle: any = {
      id: tempId,
      make: data.make,
      model: data.model,
      year: data.year as any,
      vin: data.vin,
      licensePlateNumber: data.licensePlateNumber,
      licensePlateNumberCountryCode: coercePlateCountry(
        (data as any).licensePlateNumberCountryCode ?? (data as any).licenseCountry
      ),
    };

    dispatch(
      CustomersActions.addVehicleToCustomer({
        customerId: customer.id,
        vehicle: optimisticVehicle,
      })
    );

    try {
      const created = await createVehicle({
        make: data.make ?? '',
        model: data.model ?? '',
        generation: (data as any).generation ?? '',
        type: (data as any).type ?? '',
        vin: data.vin ?? '',
        licensePlateNumber: data.licensePlateNumber ?? '',
        licensePlateNumberCountryCode: coercePlateCountry(
          (data as any).licensePlateNumberCountryCode ?? (data as any).licenseCountry
        ),
        kba: (data as any).kba ?? '',
        customerId: customer.id,
      });

      dispatch(
        CustomersActions.replaceVehicleForCustomer({
          customerId: customer.id,
          tempId,
          vehicle: created,
        })
      );

      setAddVehicleOpen(false);
    } catch (err) {
      dispatch(
        CustomersActions.removeVehicleForCustomer({
          customerId: customer.id,
          vehicleId: tempId,
        })
      );
      console.error('Failed to add vehicle', err);
    }
  };

  const isHydrating =
    loading || typeof customers === 'undefined' || (Array.isArray(customers) && customers.length === 0);

  if (isHydrating) return <Paper sx={{ p: 3 }}>{tCustomers('loading')}</Paper>;
  if (error) return <Paper sx={{ p: 3 }}>{tCustomers('failedToLoad')}</Paper>;
  if (!customer) return <Paper sx={{ p: 3 }}>{tCustomers('notFound')}</Paper>;

  const initials = `${customer.user?.firstName?.[0] ?? ''}${customer.user?.lastName?.[0] ?? ''}`;
  const headerLines = [
    customer.user?.contact?.phone,
    customer.user?.contact?.email,
    [customer.user?.address?.city, customer.user?.address?.country].filter(Boolean).join(', '),
  ].map((v) => v || 'N/A');

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <Avatar sx={{ width: 80, height: 80 }}>{initials || '?'}</Avatar>
          <Box>
            <Typography>{headerLines[0]}</Typography>
            <Typography>{headerLines[1]}</Typography>
            <Typography>{headerLines[2]}</Typography>
          </Box>
        </Box>
      </Paper>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={tCustomers('overview')} value="overview" />
        <Tab label={tCustomers('workHistory')} value="workHistory" />
        <Tab label={tEstimates('title')} value="estimates" />
        <Tab label={tCustomers('communications')} value="communications" />
      </Tabs>

      <Paper sx={{ p: 3, borderRadius: 2, minHeight: 300 }}>
        {activeTab === 'overview' && (
          <OverviewTab
            customer={customer}
            refetchCustomer={undefined}
            locale={locale}
            onAddVehicleClick={() => setAddVehicleOpen(true)}
          />
        )}
        {activeTab === 'workHistory' && <WorkHistoryTab customerId={customer.id} />}
        {activeTab === 'estimates' && <EstimatesTab customerId={customer.id} />}
        {activeTab === 'communications' && <CommunicationsTab customerId={customer.id} />}
      </Paper>

      <Dialog open={addVehicleOpen} onClose={() => setAddVehicleOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{tAdded('addVehicle')}</DialogTitle>
        <DialogContent dividers>
          <AddVehicleForm
            customerId={customer.id}
            onSubmit={handleAddVehicleSubmit}
            isSubmitting={creating}
            error={createError || null}
            onErrorClear={handleClearCreateError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddVehicleOpen(false)}>
            {tAdded('cancel')}
          </Button>
          <Button
            onClick={() => {
              const formElement = document.getElementById('vehicle-form') as any;
              if (formElement?.submitForm) formElement.submitForm();
            }}
            variant="contained"
            disabled={creating}
          >
            {creating ? tCommon('saving') : tCommon('saveChanges')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
