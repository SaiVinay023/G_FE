export const extractDigits = (phone: string): string => {
  return phone.replace(/\D/g, '');
};
