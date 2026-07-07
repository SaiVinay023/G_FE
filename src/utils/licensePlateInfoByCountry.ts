export interface LicensePlateInfo {
  country: string;
  abbreviation: string;
  bg: string;
}

export const licensePlateInfoByCountry: LicensePlateInfo[] = [
  { country: 'Germany', abbreviation: 'D', bg: '#fff' },
  { country: 'Italy', abbreviation: 'I', bg: '#fff' },
  { country: 'Spain', abbreviation: 'E', bg: '#fff' },
  { country: 'Netherlands', abbreviation: 'NL', bg: '#FCC20B' },
  { country: 'Portugal', abbreviation: 'P', bg: '#fff' },
  { country: 'France', abbreviation: 'F', bg: '#fff' },
];
