export enum BuiltInWorkCardStatus {
  EXPECTED = 1,
  IN_HOUSE = 2,
  IN_PROGRESS = 3,
  READY = 4,
  PICKED_UP = 5,
  ON_HOLD = 6,
}

export const BuiltInWorkCardStatusValues: BuiltInWorkCardStatus[] = [
  BuiltInWorkCardStatus.EXPECTED,
  BuiltInWorkCardStatus.IN_HOUSE,
  BuiltInWorkCardStatus.IN_PROGRESS,
  BuiltInWorkCardStatus.READY,
  BuiltInWorkCardStatus.PICKED_UP,
  BuiltInWorkCardStatus.ON_HOLD,
];

export const ReadableStatus = ['Unassigned', 'Expected', 'In-house', 'In-progress', 'Ready', 'Picked up', 'On hold'];

export const columnStatusTitles: { [key: number]: string } = {
  0: 'Scheduling.unassigned',
  1: 'Today.expected',
  2: 'Today.inHouse',
  3: 'Today.inProgress',
  4: 'Today.ready',
  5: 'Today.pickedUp',
  6: 'Today.onHold',
};

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export * from './schedule';
