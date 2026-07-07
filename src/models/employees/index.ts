import { Contact } from '../contact';
import { Address } from '../address';
import { Role } from '../role';
import { User } from '../user';

export interface Employee {
  id: string;
  userId?: string;
  shopId?: string;
  deleted: boolean;
  gdprConfirmedAt?: string;
  tcConfirmedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  contact: {
    email: string;
    phone: string;
  };
  address: {
    addressLine1: string;
    addressLine2?: string;
    zipcode: string;
    city: string;
    country: string;
  };
  role: {
    name: string;
  };
  password: string;
  gdprConfirmedAt: string;
  tcConfirmedAt: string;
  ignoreExisting?: boolean;
}

export interface CreateEmployeeResponse extends Employee {
  contact?: Contact;
  address?: Address;
  role?: Role;
}

// Form data type now matches the schema (no roleName)
export type EmployeeCreateFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  repeatPassword: string;
  addressLine1: string;
  addressLine2?: string;
  zipcode: string;
  city: string;
  country: string;
};
