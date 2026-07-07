import { Customer, Vehicle } from '../customer';
import { User } from '../user';

export interface GetAllEstimateQueryParams {
  user?: boolean;
  vehicle?: boolean;
  shop?: boolean;
}

export interface EstimateCreatePayload {
  title: string;
  description: string;
  creationDate: string;
  discount: number;
  expirationDate: string;
  kilometers: string;
  taxRate: string;
  status: number;
  total: string;
  totalBeforeTax: string;
  totalManHours: string;
  userId: string;
  vehicleId: string;
  publicId?: string;
  isArchived: boolean;
}

export interface EstimateWithServiceGroupsPayload {
  title: string;
  description: string;
  creationDate: string;
  discount: number;
  expirationDate: string;
  kilometers: string;
  taxRate: string;
  status: number;
  total: string;
  totalBeforeTax: string;
  totalManHours: string;
  userId: string;
  vehicleId: string;
  publicId?: string;
  isArchived: boolean;
  serviceGroups: ServiceGroupPayload[];
}

export interface ServiceGroupPayload {
  description: string;
  estimateId?: string | null;
  cannedJobId?: string | null;
  category: string;
  macroCategory: string;
  position: number;
  services: ServicePayload[];
}

export interface ServicePayload {
  internalId: string;
  description: string;
  manHours: number;
  price: number;
  position: number;
  category: string;
  checked: boolean;
  total: number;
}

export interface EstimateRes {
  id: string;
  title: string;
  description: string;
  creationDate: string;
  discount: number;
  expirationDate: string;
  kilometers: string;
  taxRate: string;
  status: number;
  total: string;
  totalBeforeTax: string;
  totalManHours: string;
  userId: string;
  vehicleId: string;
  shopId: string;
  publicId?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  customerId?: string;
  serviceGroups: ServiceGroup[];
  vehicle: Vehicle;
  user: User;
}

export interface ServiceGroup {
  id: string;
  description: string;
  position: number;
  cannedJobId: any;
  macroCategory: any;
  category: any;
  services: Service[];
}

export interface Service {
  id: string;
  internalId: string;
  description: string;
  manHours: string;
  price: number;
  total: number;
  position: number;
  checked: boolean;
}
