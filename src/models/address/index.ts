export interface Address {
  id?: string;
  addressLine1: string;
  addressLine2: string | null;
  zipcode: string;
  city: string;
  country: string;
  createdAt?: string;
  updatedAt?: string;
}
