import { Employee } from 'src/models';

export const allEmployees: Employee[] = [
  {
    id: 'd05c1d07-fc29-459d-a829-80a706f5f761',
    name: 'Maryna Kamysheva',
    email: 'some@email.co',
    userId: 'user_2j1z5DXsT7mZP4GGYHkDtlXliq2',
    deleted: false,
    phoneNumber: '+1 424 722 1555',
  },
];

export const dummyEmployees: Employee[] = Array.from({ length: 4 }, (_, i) => ({
  id: `employee-${i + 2}`,
  name: `Employee ${i + 2}`,
  userId: `user_${i + 2}`,
  deleted: false,
  phoneNumber: `38096076344${i + 2}`,
  email: `some${i + 2}@email.co`,
}));
