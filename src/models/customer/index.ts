import { User } from '../user';

export interface GetAllCustomerQueryParams {
  user?: boolean;
  vehicle?: boolean;
  name?: string;
  email?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  generation: string;
  type: string;
  vin: string;
  licensePlateNumber: string;
  licensePlateNumberCountryCode: string;
  kba: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerVehicle {
  id: string;
  customerId: string;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
  vehicle: Vehicle;
}

export interface Customer {
  id: string;
  shopId: string;
  userId: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  vehicles: CustomerVehicle[];
}

export interface CreateCustomerRequest {
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
}

export interface CreateCustomerResponse {
  id: string;
  shopId: string;
  userId: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
