import { z } from 'zod';

export const customerCreateSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    lastName: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    authId: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    shopId: z.string().optional(),
    contact: z.object({
      email: z
        .string()
        .min(1, 'EmployeeCreateForm.validation.required')
        .email('EmployeeCreateForm.validation.emailInvalid'),
      phone: z
        .string()
        .min(1, 'EmployeeCreateForm.validation.required')
        .min(10, 'EmployeeCreateForm.validation.phoneInvalid'),
    }),
    address: z.object({
      addressLine1: z.string().min(1, 'EmployeeCreateForm.validation.required'),
      addressLine2: z.string().nullable().optional(),
      zipcode: z.string().min(1, 'EmployeeCreateForm.validation.required'),
      city: z.string().min(1, 'EmployeeCreateForm.validation.required'),
      country: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    }),
  }),
  vehicle: z.object({
    licenseCountry: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    licensePlateNumber: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    make: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    model: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    generation: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    type: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    wheelOption: z.string().optional(),
  }),
});

export type CustomerCreateFormData = z.infer<typeof customerCreateSchema>;
