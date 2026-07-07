export const convertTo24HourFormat = (time12h: string): string => {
  // If already in 24-hour format with seconds (HH:MM:SS), return as is
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(time12h)) {
    return time12h;
  }

  // If already in 24-hour format without seconds (HH:MM), add seconds
  if (/^\d{1,2}:\d{2}$/.test(time12h)) {
    return `${time12h}:00`;
  }

  const [time, modifier] = time12h.split(' ');

  if (!time || !modifier) {
    throw new Error(`Invalid time format: ${time12h}`);
  }

  const splitTime = time.split(':') as [string, string];
  let hours = splitTime[0];
  const minutes = splitTime[1];

  if (!hours || !minutes) {
    throw new Error(`Invalid time format: ${time12h}`);
  }

  // Convert hours to a number for easier manipulation
  let hoursNum = parseInt(hours, 10);

  // Handle 12-hour to 24-hour conversion
  if (modifier.toUpperCase() === 'PM') {
    if (hoursNum !== 12) {
      hoursNum += 12;
    }
  } else if (modifier.toUpperCase() === 'AM' && hoursNum === 12) {
    hoursNum = 0;
  }

  // Format with leading zeros
  const formattedHours = hoursNum.toString().padStart(2, '0');
  const formattedMinutes = minutes.padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:00`;
};

export const convertTo12HourFormat = (time24h: string): string => {
  // Split the time into hours, minutes, and seconds
  const [hours, minutes] = time24h.split(':');

  if (!hours || !minutes) {
    throw new Error('Invalid time format');
  }

  // Convert hours to number for comparison
  let hoursNum = parseInt(hours, 10);

  // Determine period (AM/PM)
  const period = hoursNum >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  if (hoursNum === 0) {
    hoursNum = 12; // 00:00 becomes 12 AM
  } else if (hoursNum > 12) {
    hoursNum -= 12;
  }

  // Format the time string
  return `${hoursNum}:${minutes} ${period}`;
};
