import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form-mui';

import { ServicesFormRow } from './ServicesFormRow';
import { parseGermanNumber, formatGermanNumber } from 'src/utils/numberFormat';

interface ServicesFormProps {
  fieldIndex: number;
  isEditable?: boolean;
  action?: string;
  isCannedjob?: boolean;
}

export const ServicesForm = ({ fieldIndex, isEditable = true, action, isCannedjob = false }: ServicesFormProps) => {
  const t = useTranslations();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [manualTotalEntries, setManualTotalEntries] = useState<Set<number>>(new Set());

  const { fields, append, remove } = useFieldArray({
    control,
    name: `serviceGroups.${fieldIndex}.services`,
  });

  const serviceValues = watch(`serviceGroups.${fieldIndex}.services`);
  const serviceGroupErrors = (errors?.serviceGroups as any)?.[fieldIndex];

  const computeTotal = useCallback((manHours: string, price: string): number => {
    const hours = parseGermanNumber(manHours);
    const priceValue = parseGermanNumber(price);
    return hours * priceValue;
  }, []);

  const formatGermanTotal = useCallback((value: number): string => {
    if (value === 0) return '';

    // Format number with German locale (comma as decimal separator)
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End'];
    const isNumberOrComma = /[0-9,]/.test(event.key);

    if (!isNumberOrComma && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }, []);

  const handleAddService = useCallback(() => {
    append({
      category: '',
      internalId: '',
      description: '',
      manHours: '',
      price: '',
      total: '',
    });
  }, [append]);

  const handleRemoveService = useCallback(
    (index: number) => {
      remove(index);
      setManualTotalEntries((prev) => {
        const updated = new Set(prev);
        updated.delete(index);
        return updated;
      });
    },
    [remove],
  );

  const handleManualTotalChange = useCallback(
    (index: number, value: string) => {
      setManualTotalEntries((prev) => new Set(prev).add(index));
      setValue(`serviceGroups.${fieldIndex}.services.${index}.total`, value);
    },
    [setValue, fieldIndex],
  );

  const handleManualTotalBlur = useCallback(
    (index: number, value: string) => {
      if (!value || value.trim() === '') {
        setManualTotalEntries((prev) => {
          const updated = new Set(prev);
          updated.delete(index);
          return updated;
        });

        // Auto-calculate when manual total is cleared
        const service = serviceValues?.[index];
        if (service) {
          const calculatedTotal = computeTotal(service.manHours || '', service.price || '');
          const formattedTotal = calculatedTotal > 0 ? formatGermanTotal(calculatedTotal) : '';
          setValue(`serviceGroups.${fieldIndex}.services.${index}.total`, formattedTotal);
        }
      }
    },
    [serviceValues, computeTotal, setValue, fieldIndex, formatGermanTotal],
  );

  const handleClearManualTotal = useCallback((index: number) => {
    setManualTotalEntries((prev) => {
      const updated = new Set(prev);
      updated.delete(index);
      return updated;
    });
  }, []);

  const handleValueChange = useCallback(
    (index: number, field: 'manHours' | 'price', value: string) => {
      setValue(`serviceGroups.${fieldIndex}.services.${index}.${field}`, value);

      // Auto-calculate total if not manually overridden
      if (!manualTotalEntries.has(index)) {
        const currentService = serviceValues?.[index] || {};
        const updatedService = { ...currentService, [field]: value };

        const calculatedTotal = computeTotal(updatedService.manHours || '', updatedService.price || '');
        const formattedTotal = calculatedTotal > 0 ? formatGermanTotal(calculatedTotal) : '';
        setValue(`serviceGroups.${fieldIndex}.services.${index}.total`, formattedTotal);
      }
    },
    [setValue, fieldIndex, manualTotalEntries, serviceValues, computeTotal, formatGermanTotal],
  );

  // Auto-calculate totals when values change
  useEffect(() => {
    if (!serviceValues) return;

    serviceValues.forEach((service: any, index: number) => {
      // Skip if manually overridden
      if (manualTotalEntries.has(index)) return;

      const manHours = service?.manHours || '';
      const price = service?.price || '';
      const totalFromDB = service?.total;

      if (action === 'edit' && totalFromDB && totalFromDB !== '0') {
        // For edit mode, preserve the database value
        setValue(`serviceGroups.${fieldIndex}.services.${index}.total`, totalFromDB);
      } else if (manHours || price) {
        // Calculate total when either field has a value
        const calculatedTotal = computeTotal(manHours, price);
        const formattedTotal = calculatedTotal > 0 ? formatGermanTotal(calculatedTotal) : '';
        setValue(`serviceGroups.${fieldIndex}.services.${index}.total`, formattedTotal);
      }
    });
  }, [serviceValues, setValue, fieldIndex, computeTotal, manualTotalEntries, action, formatGermanTotal]);

  const memoizedServices = useMemo(
    () =>
      fields.map((field, index) => {
        const service = serviceValues?.[index] || {};

        return (
          <ServicesFormRow
            key={field.id}
            fieldIndex={fieldIndex}
            index={index}
            manHours={service.manHours || ''}
            price={service.price || ''}
            totalValue={service.total || ''}
            errors={serviceGroupErrors}
            isEditable={isEditable}
            isFirstRow={index === 0}
            onAddService={handleAddService}
            onRemoveService={() => handleRemoveService(index)}
            onManualTotalChange={handleManualTotalChange}
            onManualTotalBlur={handleManualTotalBlur}
            onClearManualTotal={handleClearManualTotal}
            onValueChange={handleValueChange}
            handleKeyDown={handleKeyDown}
          />
        );
      }),
    [
      fields,
      serviceValues,
      serviceGroupErrors,
      isEditable,
      fieldIndex,
      handleAddService,
      handleRemoveService,
      handleManualTotalChange,
      handleManualTotalBlur,
      handleClearManualTotal,
      handleValueChange,
      handleKeyDown,
    ],
  );

  return (
    <Box>
      {fields.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            backgroundColor: 'grey.50',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('CreateTicketForm.no_services_added')}
          </Typography>
        </Box>
      )}

      {memoizedServices}
    </Box>
  );
};
