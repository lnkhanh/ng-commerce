export class EnumModel {
  [key: string]: string;
}

export const COUNTRY_ENUM_OPTIONS: EnumModel = {
  0: 'United States',
  1: 'Canada'
};

export const US_STATE_ENUM_OPTIONS: EnumModel = {
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FM: 'Federated States Of Micronesia',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  MP: 'Northern Mariana Islands',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PW: 'Palau',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VI: 'Virgin Islands',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
};

export const CANADA_STATE_ENUM_OPTIONS: EnumModel = {
  0: 'Alberta',
  1: 'British Columbia',
  2: 'Manitoba',
  3: 'New Brunswick',
  4: 'Newfoundland',
  5: 'Northwest Territories',
  6: 'Nova Scotia',
  7: 'Nunavut',
  8: 'Ontario',
  9: 'Prince Edward Island',
  10: 'Quebec',
  11: 'Saskatchewan',
  12: 'Yukon',
};

export const DAY_OF_WEEK_ENUM_OPTIONS: EnumModel = {
  0 : 'Sunday',
  1 : 'Monday',
  2 : 'Tuesday',
  3 : 'Wednesday',
  4 : 'Thursday',
  5 : 'Friday',
  6 : 'Saturday',
};

export enum ModulesEnum {
  DXP_Commerce = 'dxp-commerce',
  ScanGo = 'scan-go',
  Customers = 'customers',
  Promotion = 'promotion',
  EMarketing = 'e-marketing',
  UserManagement = 'user-management',
  Catering = 'catering',
}
export const MODULES_ENUM_OPTIONS: EnumModel = {
  [ModulesEnum.DXP_Commerce]: 'DXP Commerce',
  [ModulesEnum.ScanGo]: 'Scan & Go',
  [ModulesEnum.Customers]: 'Customers',
  [ModulesEnum.Promotion]: 'Promotion',
  [ModulesEnum.EMarketing]: 'E-Marketing',
  [ModulesEnum.UserManagement]: 'User Management',
  [ModulesEnum.Catering]: 'Catering',
};

export enum ATTRIBUTES {
  acolhol = 'Alcohol',
  reWeight = 'ReWeight',
  countTotal = 'CountTotal',
}

export enum SERVICES {
  onlineOrder = 'OnlineOrder',
  eCom = 'eCom',
  scanAndGo = 'Scan&Go',
  nonECom = 'Non-eCom',
  giftCards = 'GiftCards',
}
export enum SERVICES_ID {
  nonEcom = 1,
  eCom = 2,
  scanAndGo = 3,
  onlineOrder = 4,
}
