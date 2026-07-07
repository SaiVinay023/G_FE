import { z } from 'zod';

export const quickShareSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .optional()
    .transform(val => val?.trim().toLowerCase()),
  phone: z.string()
    .optional()
    .transform(val => val?.trim())
    .refine(val => !val || val.replace(/\D/g, '').length >= 5, {
      message: 'Phone number is too short',
    }),
  subject: z.string()
    .min(1, 'Subject is required')
    .max(100, 'Subject too long')
    .transform(val => val.trim()),
  body: z.string()
    .min(1, 'Message is required')
    .max(1000, 'Message too long')
    .transform(val => val.trim()),
  channel: z.enum(['whatsapp', 'sms', 'email']),
}).superRefine((data, ctx) => {
  if (data.channel === 'email' && !data.email?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Email is required for Email channel',
      path: ['email'],
    });
  }

  if ((data.channel === 'sms' || data.channel === 'whatsapp') && !data.phone?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Phone is required for SMS/WhatsApp',
      path: ['phone'],
    });
  }
});