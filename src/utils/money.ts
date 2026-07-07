import { roundToUp } from 'round-to';

export const formatMoney = (amount: number): string => {
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);

  return formattedAmount === 'NaN €' ? '0' : formattedAmount;
};

export const formatToCents = (num: number): number => roundToUp(roundToUp(num, 2) * 100, 2);
