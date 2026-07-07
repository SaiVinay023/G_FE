export const parseGermanNumber = (value: string): number => {
  if (!value || value.trim() === '') return 0;
  const normalizedValue = value.replace(',', '.');
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : parsed;
};

export const normalizeDecimalString = (value: string): string => {
  const parsed = parseGermanNumber(value);
  return parsed.toString();
};

export const formatGermanNumber = (value: number): string => {
  if (value === 0) return '';
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatGermanCurrency = (amount: number): string => {
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);

  return formattedAmount === 'NaN €' ? '0' : formattedAmount;
};
