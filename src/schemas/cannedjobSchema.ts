import { Category } from 'src/store/slices/cannedJobsSlice';
import z from 'zod';

export const serviceSchema = z.object({
  id: z.string().optional(),
  category: z.nativeEnum(Category).refine((val) => val !== Category.All, {
    message: 'Please select a valid category',
  }),
  description: z.string().min(1, 'Description is required'),
  internalId: z.string().min(1, 'Internal ID is required'),
  manHours: z.number().min(0, 'Man hours must be 0 or greater'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  total: z.number().min(0, 'Total must be 0 or greater'),
  position: z.number().min(1, 'Position must be at least 1'),
});

export const cannedJobSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  services: z.array(serviceSchema).min(1, 'At least one service is required'),
});

export const updateCannedJobSchema = z.object({
  shopId: z.string().min(1, 'Shop ID is required'),
  serviceGroupId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  category: z.string().optional(),
  macroCategory: z.string().nullable().optional(),
  position: z.number().min(1).optional(),
  services: z.array(serviceSchema).min(1, 'At least one service is required'),
});

export type CannedJobFormData = z.infer<typeof cannedJobSchema>;
export type UpdateCannedJobFormData = z.infer<typeof updateCannedJobSchema>;
