import { Shop } from 'src/models';

export const dummyShop: Shop = {
  language: 'en',
  id: '55db91ee-324e-42de-b431-cf028db9babe',
  name: "Marina's shop",
  email: 'maryna@carsu.com',
  logo: '55db91ee-324e-42de-b431-cf028db9babe',
  logoUrl:
    'https://tkvwatvbapsmkhyyzbto.supabase.co/storage/v1/object/public/public-shop-logos/55db91ee-324e-42de-b431-cf028db9babe',
  billingAddress: null,
  shopAddress: {
    id: 'd2a3e19e-88c0-4467-9a7c-5f4c4a6a6e71',
    addressLine1: 'Some street',
    addressLine2: '',
    zipcode: '123456',
    city: 'Some city1',
    country: 'it',
  },
  vatNumber: '123456',
  phoneNumber: '+380 96 076 3440',
  vatId: 'a0a2e8b7-ad6e-476e-8173-24444a54148d',
  vat: '20.00',
  hourlyRate: 100,
  startTime: '7:30:00',
  endTime: '20:00:00',
  workSchedules: [
    {
      day: 0,
      start: '8:30:00',
      finish: '18:00:00',
      day_off: 0,
      breaks: [
        {
          from: '12:00:00',
          to: '13:00:00',
        },
      ],
    },
    {
      day: 1,
      start: '8:30:00',
      finish: '16:30:00',
      day_off: 0,
      breaks: [
        {
          from: '12:00:00',
          to: '13:00:00',
        },
      ],
    },
    {
      day: 2,
      start: '8:30:00',
      finish: '16:30:00',
      day_off: 0,
      breaks: [
        {
          from: '12:00:00',
          to: '13:00:00',
        },
      ],
    },
    {
      day: 3,
      start: '8:30:00',
      finish: '16:30:00',
      day_off: 0,
      breaks: [
        {
          from: '12:00:00',
          to: '12:30:00',
        },
      ],
    },
    {
      day: 4,
      start: '8:30:00',
      finish: '17:00:00',
      day_off: 0,
      breaks: [
        {
          from: '12:00:00',
          to: '13:00:00',
        },
      ],
    },
    {
      day: 5,
      start: '8:30:00',
      finish: '18:00:00',
      day_off: 0,
      breaks: [],
    },
    {
      day: 6,
      start: null,
      finish: null,
      day_off: 1,
      breaks: [],
    },
  ],
  whatsappPhoneNumberId: null,
  whatsappAccessToken: null,
  whatsappWabaId: null,
  isWhatsappRegistered: false,
};
