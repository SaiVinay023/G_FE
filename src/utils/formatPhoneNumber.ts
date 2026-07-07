import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Formats a phone number into an international format.
 * Automatically detects the country from the number.
 * @param phone The phone number as a string
 * @returns Formatted phone number or a fallback message if formatting fails
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return 'No phone number available';

  try {
    const phoneWithPlus = phone.trim().startsWith('+') ? phone : `+${phone.replace(/^\+/, '')}`;

    const parsedNumber = parsePhoneNumberFromString(phoneWithPlus);

    if (parsedNumber?.isValid()) {
      return parsedNumber.formatInternational();
    }
  } catch (error) {
    console.error('Error formatting phone number:', error);
  }

  return phone; // Return the original number if parsing fails
};
