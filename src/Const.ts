export const JWT_TOKEN = 'JID';

export const LANGUAGES = [
  { label: 'Portuguese', value: 'pt' },
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
];

export const COUNTRIES = [
  { label: 'Brazil', value: 'br' },
  { label: 'Canada', value: 'ca' },
  { label: 'United States', value: 'us' },
  { label: 'Mexico', value: 'mx' },
];

export const SORT_SAFE_BY = [
  { label: 'Sort by date (ascending)', value: 'asc' },
  { label: 'Sort by date (desc)', value: 'desc' },
  { label: 'Sort by name', value: 'name' },
];

export const WEEKDAY = [
  { label: 'Sunday', value: 'sun' },
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wed' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sat' },
];

export const SHARE_COUNT = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];

export const SHARE_COUNT_TYPE = [
  { label: 'days', value: 'days' },
  { label: 'weeks', value: 'weeks' },
];

export const SHARE_COUNT_NOT_ANSWERED = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];

export const TIMEZONE_BRAZIL = [
  { label: 'São Paulo', value: 'America/Sao_Paulo' },
  { label: 'Fortaleza', value: 'America/Fortaleza' },
  { label: 'Manaus', value: 'America/Manaus' },
  { label: 'Cuiabá', value: 'America/Cuiaba' },
  { label: 'Belém', value: 'America/Belem' },
  { label: 'Bahia', value: 'America/Bahia' },
  { label: 'Porto Velho', value: 'America/Porto_Velho' },
  { label: 'Boa Vista', value: 'America/Boa_Vista' },
  { label: 'Eirunepé', value: 'America/Eirunepe' },
  { label: 'Noronha', value: 'America/Noronha' },
];

export const TIMEZONE_MEXICO = [
  { label: 'Mexico City', value: 'America/Mexico_City' },
  { label: 'Cancún', value: 'America/Cancun' },
  { label: 'Monterrey', value: 'America/Monterrey' },
  { label: 'Tijuana', value: 'America/Tijuana' },
  { label: 'Hermosillo', value: 'America/Hermosillo' },
];

export const TIMEZONE_USA = [
  { label: 'New York', value: 'America/New_York' },
  { label: 'Chicago', value: 'America/Chicago' },
  { label: 'Denver', value: 'America/Denver' },
  { label: 'Los Angeles', value: 'America/Los_Angeles' },
  { label: 'Anchorage', value: 'America/Anchorage' },
  { label: 'Honolulu', value: 'Pacific/Honolulu' },
];

export const TIMEZONE_CANADA = [
  { label: 'Toronto', value: 'America/Toronto' },
  { label: 'Vancouver', value: 'America/Vancouver' },
  { label: 'Edmonton', value: 'America/Edmonton' },
  { label: 'Winnipeg', value: 'America/Winnipeg' },
  { label: 'Halifax', value: 'America/Halifax' },
  { label: "St. John's", value: 'America/St_Johns' },
];

export const COUNTRY_TIMEZONES: TCountryTimezones = {
  br: TIMEZONE_BRAZIL,
  ca: TIMEZONE_CANADA,
  us: TIMEZONE_USA,
  mx: TIMEZONE_MEXICO,
};
