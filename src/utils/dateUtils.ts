/** Returns "HH:MM:SS" in UTC from a Date */
export const toHHMMSS = (d: Date): string => d.toISOString().slice(11, 19);

/** Returns full UTC ISO string ending with "Z" */
export const toISOZ = (d: Date): string => d.toISOString();
