export type IAccountModel = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  provider: string;
  state?: string;
  gender: string;
  avatar?: string;
  cover?: string;
  role?: string,
  username?: string;
  nick?: string;
  phone?: string;
  ipAddress?: string;
  password?: string;
  facebookProvider?: any;
  companyId?: string;
  storeId?: string;
  lastVisitedStoreId?: string;
  isActivate?: boolean;
  address?: string;
  createdAt?: string;
  lastLogin?: string;
};