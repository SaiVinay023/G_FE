// src/utils/phoneUtils.ts
import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Normalize a phone number into strict E.164 format (+15551234567).
 * Removes spaces, dashes, parentheses.
 */
export const normalizePhone = (raw: string): string => {
  if (!raw) return '';
  let s = raw.trim().replace(/[^\d+]/g, '');
  if (s && !s.startsWith('+')) s = `+${s}`;
  return s;
};

/**
 * Formats a phone number into international readable format
 * Example: +15551234567 -> "+1 555 123 4567"
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  try {
    const parsed = parsePhoneNumberFromString(normalizePhone(phone));
    if (parsed?.isValid()) return parsed.formatInternational();
  } catch (err) {
    console.error('Error formatting phone number:', err);
  }
  return normalizePhone(phone);
};

/**
 * Strict E.164 normalization
 */
export const normalizeE164 = (phone: string): string => {
  if (!phone) return '';
  try {
    const parsed = parsePhoneNumberFromString(normalizePhone(phone));
    if (parsed?.isValid()) return parsed.number;
  } catch (err) {
    console.error('Error normalizing phone number:', err);
  }
  return normalizePhone(phone);
};

/**
 * Check if string looks like E.164 format
 */
export const isE164ish = (phone: string): boolean =>
  /^\+\d{7,15}$/.test(phone || '');

// Returns upper-case ISO-2 (e.g., "IT") or null
export const getRegionFromPhone = (phone: string): string | null => {
  if (!phone) return null;
  try {
    const p = parsePhoneNumberFromString(normalizePhone(phone));
    if (p?.isValid() && p.country) return p.country; // "IT"
  } catch {}
  return null;
};

// Convenience: lower-case ISO-2 (e.g., "it") for UI components
export const getRegionLowerFromPhone = (phone: string): string | null => {
  const c = getRegionFromPhone(phone);
  return c ? c.toLowerCase() : null;
};