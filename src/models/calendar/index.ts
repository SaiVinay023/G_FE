import { Customer, Vehicle } from 'src/models';

import { WorkCard } from '../today';

export interface CalendarEvent {
  id: string;
  title: string;
  break: boolean;
  description?: string;
  start: string | Date;
  end: string | Date;
  allDay?: boolean;
  cardData?: WorkCard;
  customer?: Customer;
  vehicle?: Vehicle | null;
}
