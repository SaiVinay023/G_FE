import { BuiltInWorkCardStatus } from 'src/models';
import { Vehicle } from 'src/models';

export interface Cards {
  [key: string]: WorkCard[];
}

export interface WorkCard {
  id: string;
  lastChange: string;
  pickUpDate: string;
  dropOffDate: string;
  assignee?: {
    id: string;
    name: string;
    email?: string;
    userId: string;
    deleted: boolean;
    phoneNumber: string;
  };
  assignedDate: string;
  status: BuiltInWorkCardStatus;
  position: number;
  estimateId: string;
  confirmed: boolean;
  emailId: string | null;
  removed: boolean;
  title: string;
  customer: {
    id: string;
    name: string;
    email?: string;
    phoneNumber: string;
  };
  vehicle: Vehicle;
}
