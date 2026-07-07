import { Address } from '../address';
import { Contact } from '../contact';
import { WorkSchedule } from '../work/schedule';

export interface Shop {
  id?: string;
  name: string;
  vatNumber: string;
  contact: Contact;
  address: Address;
  logo: string;
  enabled: boolean;
  hourlyRate: number;
  vatId: string;
  createdAt?: string;
  updatedAt?: string;
  language?: string;
  workSchedules?: WorkSchedule[];
  // whatsappPhoneNumberId: string | null;
  // whatsappAccessToken: string | null;
  // whatsappWabaId: string | null;
  // isWhatsappRegistered: boolean;
}

export type CreateShop = Omit<Shop, 'id' | 'language' | 'workSchedules'> & {
  address: Omit<Address, 'id'>;
  contact: Omit<Contact, 'id'>;
};
