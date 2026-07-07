import { z } from 'zod';

export const whatsappCredentialsSchema = z.object({
  id: z.string(),
  shopId: z.string(),
  phoneNumberId: z.string().min(1, 'Phone Number ID is required'),
  wbaId: z.string().min(1, 'WABA ID is required'),
  isRegistered: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const updateWhatsappCredentialsSchema = z.object({
  phoneNumberId: z.string().min(1, 'Phone Number ID is required'),
  wbaId: z.string().min(1, 'WABA ID is required'),
  accessToken: z.string().min(1, 'Access Token is required'),
});

export type WhatsAppCredentials = z.infer<typeof whatsappCredentialsSchema>;
export type UpdateWhatsAppCredentialsRequest = z.infer<typeof updateWhatsappCredentialsSchema>;
