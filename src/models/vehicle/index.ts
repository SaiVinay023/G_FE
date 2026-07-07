export interface Vehicle {
  id?: string;
  make: string;
  model: string;
  generation: string;
  type: string;
  vin: string;
  licensePlateNumber: string;
  licensePlateNumberCountryCode: string;
  kba: string;
  customerId: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVehicleRequest {
  make: string;
  model: string;
  generation: string;
  type: string;
  vin: string;
  licensePlateNumber: string;
  licensePlateNumberCountryCode: string;
  kba: string;
  customerId: string;
}
