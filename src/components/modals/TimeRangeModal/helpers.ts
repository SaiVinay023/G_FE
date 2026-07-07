export const availableTimes = [
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
];

export const compareTimes = (start: string, end: string): boolean => {
  try {
    const startParts = start.match(/(\d+):(\d+)\s*([AP]M)/i);
    const endParts = end.match(/(\d+):(\d+)\s*([AP]M)/i);

    if (!startParts || !endParts) return false;

    let startHour = parseInt(startParts[1], 10);
    const startMinute = parseInt(startParts[2], 10);
    const startAmPm = startParts[3].toUpperCase();

    let endHour = parseInt(endParts[1], 10);
    const endMinute = parseInt(endParts[2], 10);
    const endAmPm = endParts[3].toUpperCase();

    if (startAmPm === 'PM' && startHour < 12) startHour += 12;
    if (startAmPm === 'AM' && startHour === 12) startHour = 0;

    if (endAmPm === 'PM' && endHour < 12) endHour += 12;
    if (endAmPm === 'AM' && endHour === 12) endHour = 0;

    if (startHour > endHour) return true;
    if (startHour === endHour && startMinute >= endMinute) return true;

    return false;
  } catch (error) {
    console.error('Error comparing times:', error);
    return false;
  }
};
