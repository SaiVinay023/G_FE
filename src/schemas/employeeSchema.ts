import { z } from 'zod';

export const employeeCreateSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'EmployeeCreateForm.validation.required')
      .min(2, 'EmployeeCreateForm.validation.minLength'),
    lastName: z
      .string()
      .min(1, 'EmployeeCreateForm.validation.required')
      .min(2, 'EmployeeCreateForm.validation.minLength'),
    email: z
      .string()
      .min(1, 'EmployeeCreateForm.validation.required')
      .email('EmployeeCreateForm.validation.emailInvalid'),
    phoneNumber: z
      .string()
      .min(1, 'EmployeeCreateForm.validation.required')
      .min(10, 'EmployeeCreateForm.validation.phoneInvalid'),
    addressLine1: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    addressLine2: z.string().optional(),
    zipcode: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    city: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    country: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    password: z
      .string()
      .min(1, 'EmployeeCreateForm.validation.required')
      .min(6, 'EmployeeCreateForm.validation.passwordTooShort'),
    repeatPassword: z.string().min(1, 'EmployeeCreateForm.validation.required'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'EmployeeCreateForm.validation.passwordsDontMatch',
    path: ['repeatPassword'],
  });

export type EmployeeCreateFormData = z.infer<typeof employeeCreateSchema>;
