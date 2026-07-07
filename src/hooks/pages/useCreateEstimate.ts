'use client';

import { useCallback, useState, useMemo } from 'react';

import { FormValues, Service as FormService } from 'src/components/Estimates/CreateEstimateForm';
import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { selectCurrentEstimate } from 'src/store/selectors/estimatesSelectors';
import { EstimatesActions } from 'src/store/slices/estimatesSlice';
import { useGetCustomerByIdQuery } from 'src/api/customerApi';
import { useGetVatsQuery } from 'src/api/vatApi';
import { parseGermanNumber } from 'src/utils/numberFormat';

import { useShop } from './useShop';
import { useRouter } from 'src/i18n/routing';

const calculateManHoursTotal = (serviceGroups: FormValues['serviceGroups']): number => {
  return serviceGroups.reduce(
    (total, group) =>
      total +
      group.services.reduce((groupTotal, service) => groupTotal + (parseGermanNumber(service.manHours) || 0), 0),
    0,
  );
};

const createServiceGroupsPayload = (serviceGroups: FormValues['serviceGroups']) => {
  return serviceGroups.map((group, groupIndex) => ({
    description: group.description,
    estimateId: null,
    cannedJobId: null,
    category: group.category,
    macroCategory: group.category,
    position: groupIndex + 1,
    services: group.services.map((service, serviceIndex) => ({
      internalId: service.internalId,
      description: service.description,
      manHours: parseGermanNumber(service.manHours) || 0,
      price: parseGermanNumber(service.price) || 0,
      position: serviceIndex + 1,
      category: group.category || 'Services',
      checked: true,
      total: parseGermanNumber(service.total || '0') || 0,
    })),
  }));
};

export const useCreateEstimate = (contactId: string, vehicleId: string) => {
  const dispatch = useAppDispatch();
  const { shop, loading: shopLoading } = useShop();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: customer,
    isLoading: customerLoading,
    error: customerError,
  } = useGetCustomerByIdQuery(contactId, {
    skip: !contactId,
  });

  const { data: vats = [], isLoading: isLoadingVats } = useGetVatsQuery();
  const currentEstimate = useAppSelector(selectCurrentEstimate);

  const vehicle = useMemo(
    () => customer?.vehicles.find((v) => v.vehicle.id === vehicleId)?.vehicle,
    [customer, vehicleId],
  );

  const vatRate = useMemo(() => {
    if (!shop?.vatId || isLoadingVats) {
      return '0.22';
    }

    const shopVat = vats.find((vat) => vat.id === shop.vatId);
    if (shopVat) {
      return (Number(shopVat.vat) / 100).toString();
    }

    return '0.22';
  }, [shop?.vatId, vats, isLoadingVats]);

  const defaultFormValues = useMemo<FormValues>(() => {
    const emptyFormService: FormService = {
      description: '',
      internalId: '',
      manHours: '',
      price: '',
      total: '',
    };

    return {
      serviceTitle: '',
      customerComments: '',
      kms: '',
      serviceGroups: [
        {
          description: '',
          category: '',
          services: [emptyFormService],
        },
      ],
      discount: '0',
      subTotal: '',
      vat: vatRate,
      total: '',
    };
  }, [vatRate]);

  const initialValues = useMemo<FormValues>(() => {
    if (currentEstimate) {
      const formServiceGroups =
        currentEstimate.serviceGroups?.map((group) => ({
          description: group.description || '',
          category: group.category?.name || '',
          services:
            group.services?.map((service) => ({
              description: service.description || '',
              internalId: service.internalId || '',
              manHours: service.manHours || '',
              price: service.price?.toString() || '',
              total: service.total?.toString() || '',
            })) || [],
        })) || [];

      return {
        serviceTitle: currentEstimate.title || '',
        customerComments: currentEstimate.description || '',
        kms: currentEstimate.kilometers?.toString() || '',
        serviceGroups: formServiceGroups,
        discount: currentEstimate.discount?.toString() || '0',
        subTotal: currentEstimate.totalBeforeTax?.toString() || '',
        vat: currentEstimate.taxRate || vatRate,
        total: currentEstimate.total?.toString() || '',
      };
    }

    return defaultFormValues;
  }, [currentEstimate, defaultFormValues, vatRate]);

  const handleSave = useCallback(
    async (data: FormValues): Promise<void> => {
      if (!customer?.user?.id) {
        throw new Error('Customer user ID is required');
      }

      setIsSaving(true);
      try {
        const serviceGroups = createServiceGroupsPayload(data.serviceGroups);
        const totalManHours = calculateManHoursTotal(data.serviceGroups);

        const estimatePayload = {
          title: data.serviceTitle,
          description: data.customerComments,
          creationDate: new Date().toISOString(),
          discount: parseGermanNumber(data.discount) || 0,
          expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          kilometers: data.kms,
          taxRate: (parseGermanNumber(data.vat) || 0).toString(),
          status: 101,
          total: (parseGermanNumber(data.total) || 0).toString(),
          totalBeforeTax: (parseGermanNumber(data.subTotal) || 0).toString(),
          totalManHours: totalManHours.toString(),
          userId: customer.user.id,
          vehicleId,
          publicId: `EST_${new Date().getFullYear()}_${Date.now()}`,
          isArchived: false,
          serviceGroups,
        };

        await dispatch(EstimatesActions.createEstimateWithServiceGroups(estimatePayload)).unwrap();

        // Navigate to estimates list after successful creation
        router.push('/estimates');
      } catch (error) {
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [customer?.user?.id, vehicleId, dispatch, router],
  );

  const handleCancel = useCallback(() => {
    router.push('/estimates');
  }, [router]);

  const loading = useMemo(
    () => shopLoading || customerLoading || isLoadingVats,
    [shopLoading, customerLoading, isLoadingVats],
  );

  return {
    shop,
    customer,
    vehicle,
    initialValues,
    defaultValues: defaultFormValues,
    loading,
    isSaving,
    handleSave,
    handleCancel,
  };
};
