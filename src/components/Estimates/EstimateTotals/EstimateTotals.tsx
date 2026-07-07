import { Check as CheckIcon } from '@mui/icons-material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form-mui';

import { Service } from 'src/components/Estimates';
import { FormTextField } from 'src/components/fields';
import { Shop } from 'src/models';
import { useGetVatsQuery } from 'src/api/vatApi';
import { formatMoney } from 'src/utils/money';
import { parseGermanNumber, formatGermanNumber } from 'src/utils/numberFormat';

interface EstimateTotalsProps {
  shop?: Shop;
}

export const EstimateTotals = ({ shop }: EstimateTotalsProps) => {
  const t = useTranslations();
  const { control, setValue } = useFormContext();
  const [isEditTotal, setIsEditTotal] = useState(false);
  const [isEditDiscount, setIsEditDiscount] = useState(false);
  const [customTotal, setCustomTotal] = useState<string>('');
  const [customDiscount, setCustomDiscount] = useState<string>('');
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);
  const [showDiscountAndNet, setShowDiscountAndNet] = useState(false);

  const serviceGroups = useWatch({ control, name: 'serviceGroups' });
  const discountValue = useWatch({ control, name: 'discount' }) || '';
  const totalValue = useWatch({ control, name: 'total' }) || 0;

  const { data: vats = [], isLoading: isLoadingVats } = useGetVatsQuery();

  const vatRate = useMemo(() => {
    if (!shop?.vatId || isLoadingVats) {
      return 0.22; // Default fallback to 22%
    }

    const shopVat = vats.find((vat) => vat.id === shop.vatId);
    if (shopVat) {
      return Number(shopVat.vat) / 100; // Convert percentage to decimal
    }

    return 0.22; // Default fallback
  }, [shop?.vatId, vats, isLoadingVats]);

  const discount = useMemo(() => parseGermanNumber(discountValue), [discountValue]);

  const calculateSubTotal = useMemo((): number => {
    return (
      serviceGroups?.reduce((total: number, group: { services: Service[] }) => {
        return (
          total +
          group.services.reduce((sum, service) => {
            const manHours = parseGermanNumber(service.manHours || '');
            const price = parseGermanNumber(service.price || '');
            return sum + manHours * price;
          }, 0)
        );
      }, 0) || 0
    );
  }, [serviceGroups]);

  const calculations = useMemo(() => {
    const subTotal = calculateSubTotal;
    const netAmount = Math.max(subTotal - discount, 0);
    const vatAmount = Math.round(netAmount * vatRate * 100) / 100;
    const total = netAmount + vatAmount;

    return {
      subTotal,
      netAmount,
      vatAmount,
      total,
    };
  }, [calculateSubTotal, discount, vatRate]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End'];
    const isNumberOrComma = /[0-9,]/.test(event.key);

    if (!isNumberOrComma && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }, []);

  const handleCustomTotalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTotal(e.target.value);
  }, []);

  const handleCustomDiscountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDiscount(e.target.value);
  }, []);

  const handleToggleEditTotal = useCallback(() => {
    setIsEditTotal(!isEditTotal);
    if (isEditTotal) {
      setCustomTotal('');
    }
  }, [isEditTotal]);

  const handleToggleEditDiscount = useCallback(() => {
    setIsEditDiscount(!isEditDiscount);
    if (isEditDiscount) {
      setCustomDiscount('');
    }
  }, [isEditDiscount]);

  const handleCloseTotal = useCallback(() => {
    setIsEditTotal(false);
    setCustomTotal('');
    setIsManuallyEdited(false);
    setValue('total', formatGermanNumber(calculations.total));
  }, [setValue, calculations.total]);

  const handleCloseDiscount = useCallback(() => {
    setIsEditDiscount(false);
    setCustomDiscount('');
    setValue('discount', formatGermanNumber(discount));
  }, [setValue, discount]);

  const handleSaveTotal = useCallback(() => {
    if (customTotal !== '') {
      const parsedTotal = parseGermanNumber(customTotal);
      const subTotal = calculations.subTotal;

      // Calculate the required discount to achieve the custom total
      // Formula: customTotal = (subTotal - discount) * (1 + vatRate)
      // Solving for discount: discount = subTotal - (customTotal / (1 + vatRate))
      const requiredNetAmount = parsedTotal / (1 + vatRate);
      const calculatedDiscount = Math.max(0, subTotal - requiredNetAmount);

      setValue('discount', formatGermanNumber(calculatedDiscount), { shouldValidate: true, shouldDirty: true });
      setValue('total', formatGermanNumber(parsedTotal));
      setIsManuallyEdited(true);
      setCustomTotal('');

      // Show discount and net amount when total is manually edited
      setShowDiscountAndNet(true);
    }
    setIsEditTotal(false);
  }, [setValue, customTotal, calculations.subTotal, vatRate]);

  const handleSaveDiscount = useCallback(() => {
    if (customDiscount !== '') {
      const parsedDiscount = parseGermanNumber(customDiscount);
      setValue('discount', formatGermanNumber(parsedDiscount), { shouldValidate: true, shouldDirty: true });
      setCustomDiscount('');
    }
    setIsEditDiscount(false);
  }, [setValue, customDiscount]);

  const displayTotal = useMemo(() => {
    if (isManuallyEdited) {
      return parseGermanNumber(totalValue.toString());
    }
    return calculations.total;
  }, [isManuallyEdited, totalValue, calculations.total]);

  useEffect(() => {
    setValue('subTotal', formatGermanNumber(calculations.subTotal));
    setValue('vat', formatGermanNumber(calculations.vatAmount));

    if (!isManuallyEdited) {
      setValue('total', formatGermanNumber(calculations.total));
    }
  }, [calculations, isManuallyEdited, setValue]);

  useEffect(() => {
    setIsManuallyEdited(false);
    setCustomTotal('');
    setCustomDiscount('');
    setIsEditTotal(false);
    setIsEditDiscount(false);
    setShowDiscountAndNet(false);
  }, [serviceGroups]);

  // Show discount and net amount if there's a discount value
  useEffect(() => {
    if (discount > 0) {
      setShowDiscountAndNet(true);
    }
  }, [discount]);

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>{t('CreateTicketForm.sub_total')}:</Typography>

              {showDiscountAndNet && (
                <>
                  <Typography>{t('CreateTicketForm.discount')}:</Typography>
                  <Typography>{t('CreateTicketForm.net_amount')}:</Typography>
                </>
              )}

              <Typography>
                {t('CreateTicketForm.vat')} ({(vatRate * 100).toFixed(0)}%):
              </Typography>
              <Typography fontWeight="bold">{t('CreateTicketForm.total')}:</Typography>
            </Grid>

            <Grid size={{ xs: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'right' }}>
              <Typography>{formatMoney(calculations.subTotal)}</Typography>

              {showDiscountAndNet && (
                <>
                  {/* Discount Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      flexWrap: 'nowrap',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Typography color="error">
                      -{formatMoney(isEditDiscount && customDiscount ? parseGermanNumber(customDiscount) : discount)}
                    </Typography>

                    <IconButton size="small" color="primary" onClick={handleToggleEditDiscount}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {isEditDiscount && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                      <FormTextField
                        size="small"
                        name="customDiscount"
                        placeholder={t('CreateTicketForm.discount')}
                        value={customDiscount}
                        onChange={handleCustomDiscountChange}
                        onKeyDown={handleKeyDown}
                        inputProps={{
                          inputMode: 'decimal',
                        }}
                      />
                      <IconButton size="small" color="primary" onClick={handleSaveDiscount}>
                        <CheckIcon fontSize="small" />
                      </IconButton>

                      <IconButton size="small" color="error" onClick={handleCloseDiscount}>
                        <CloseOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}

                  {/* Net Amount Row */}
                  <Typography>{formatMoney(calculations.netAmount)}</Typography>
                </>
              )}

              <Typography>{formatMoney(calculations.vatAmount)}</Typography>

              {/* Total Row */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'nowrap', justifyContent: 'flex-end' }}
              >
                <Typography fontWeight="bold">
                  {formatMoney(isEditTotal && customTotal ? parseGermanNumber(customTotal) : displayTotal)}
                </Typography>

                <IconButton size="small" color="primary" onClick={handleToggleEditTotal}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>

              {isEditTotal && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                  <FormTextField
                    size="small"
                    name="customTotal"
                    placeholder={t('CreateTicketForm.new_total')}
                    value={customTotal}
                    onChange={handleCustomTotalChange}
                    onKeyDown={handleKeyDown}
                    inputProps={{
                      inputMode: 'decimal',
                    }}
                  />
                  <IconButton size="small" color="primary" onClick={handleSaveTotal}>
                    <CheckIcon fontSize="small" />
                  </IconButton>

                  <IconButton size="small" color="error" onClick={handleCloseTotal}>
                    <CloseOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
