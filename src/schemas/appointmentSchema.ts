import { z } from 'zod';

const E164 = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{6,14}$/, 'Phone must be in +{country}{number} format (E.164)');

export const appointmentSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    startTime: z.date({ required_error: 'Start time is required' }),
    endTime: z.date({ required_error: 'End time is required' }),
    assignedTo: z.string().optional(), // "Unassigned" allowed
    comments: z.string().optional().default(''),
    customer: z.object({
      name: z.string().trim().min(1, 'Customer name is required'),
      phone: E164,
      email: z
        .string()
        .trim()
        .email('Invalid email')
        .optional()
        .or(z.literal('')), // allow empty
      licensePlate: z.string().optional(),
    }),
  })
  .refine(
    (data) => data.endTime.getTime() >= data.startTime.getTime() + 30 * 60 * 1000,
    {
      message: 'End time must be at least 30 minutes after start time',
      path: ['endTime'],
    }
  );

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
