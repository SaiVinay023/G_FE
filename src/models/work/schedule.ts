export interface WorkSchedule {
  id: string;
  shopId: string;
  day: number;
  start: string;
  finish: string;
  dayOff: boolean;
  breakFrom: string;
  breakTo: string;
  createdAt?: string;
  updatedAt?: string;
}

export type WorkScheduleRequest = Omit<WorkSchedule, 'id' | 'createdAt' | 'updatedAt'>;

export interface DeleteWorkScheduleResponse {
  message: string;
  id: string;
}

export interface BulkWorkScheduleRequest {
  weeklySchedule: WorkScheduleRequest[];
}

export interface UpdateBulkScheduleRequest {
  weeklySchedule: Array<WorkScheduleRequest & { id: string }>;
}

export interface FormWorkSchedule {
  day_off: number;
  start: string | null;
  finish: string | null;
  breaks: Array<{
    from: string | null;
    to: string | null;
  }>;
}
