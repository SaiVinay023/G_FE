import { Address } from '../address';
import { Contact } from '../contact';
import { Shop } from '../settings';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Employee = 'Employee',
  Customer = 'Customer',
  Owner = 'Owner',
}

export interface Role {
  id?: string;
  name: UserRole;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  authId: string;
  shopId?: string;
  contact?: Contact;
  address?: Address;
  role?: Role;
  shop?: Shop;
  createdAt?: string;
  updatedAt?: string;
}
