import { Customer } from 'src/models';

export const allCustomers: Customer[] = [
  {
    id: '6335f544-98bd-4fa8-92ee-3d7a80ca571b',
    name: 'new one',
    email: 'kam.marvic@gmail.com',
    phoneNumber: '380960763440',
    vehicles: [
      {
        id: 'a5a79a9a-9d0e-431a-bd3e-6754161dbb34',
        contactPerson: '6335f544-98bd-4fa8-92ee-3d7a80ca571b',
        vin: null,
        licensePlateNumber: '6767676',
        licensePlateNumberCountryCode: 'D',
        kba: null,
        make: 'Mercedes-Benz',
        model: 'GLS-Class AMG',
        generation: 'X167 Facelift',
        type: 'GLS 63',
        image: 'https://cdn.wheel-size.com/automobile/body/mercedes-gls-class-amg-2023-2024-1703056032.064086.jpg',
      },
    ],
    address: {
      id: '203cb128-e95f-408d-85a4-69513c6b28e5',
      addressLine: 'street',
      zipcode: '913000',
      city: 'city',
      country: 'it',
      customerId: '6335f544-98bd-4fa8-92ee-3d7a80ca571b',
    },
  },
];

export const dummyCustomers: Customer[] = Array.from({ length: 4 }, (_, i) => ({
  id: `customer-${i + 2}`,
  name: `Customer ${i + 2}`,
  email: `customer${i + 2}@example.com`,
  phoneNumber: `38096076344${i + 2}`,
  vehicles: [
    {
      id: `vehicle-${i + 2}`,
      contactPerson: `customer-${i + 2}`,
      vin: null,
      licensePlateNumber: `License-${i + 2}`,
      licensePlateNumberCountryCode: 'D',
      kba: null,
      make: 'Brand',
      model: 'Model',
      generation: 'Gen',
      type: 'Type',
      image: 'https://via.placeholder.com/150',
    },
  ],
  address: {
    id: `address-${i + 2}`,
    addressLine: `Street ${i + 2}`,
    zipcode: `Zip${i + 2}`,
    city: `City ${i + 2}`,
    country: 'it',
    customerId: `customer-${i + 2}`,
  },
}));
