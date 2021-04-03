export interface UserType {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  provider?: string;
  state?: string;
  gender: string;
  avatar?: string;
  cover?: string;
  role?: string;
  username?: string;
  nick?: string;
  phone?: string;
  ipAddress?: string;
  password?: string;
  facebookProvider?: any;
  companyId?: string;
  branchId?: string;
  lastVisitedBranchId?: string;
  isActivate?: boolean;
  address?: string;
}

export enum GenderEnum {
  Male = 'M',
  Female = 'F',
}

export const genderOptions = [
  { name: 'Male', value: GenderEnum.Male },
  {
    name: 'Female',
    value: GenderEnum.Female,
  },
];

export enum PermissionEnum {
  SystemUser = 'USER_SYSTEM',
  CustomerUser = 'ROLE_USER',
  StaffUser = 'USER_STAFF'
}

export const permissionOptions = [
  {
    name: 'Administrator',
    value: PermissionEnum.SystemUser,
  },
  {
    name: 'Staff',
    value: PermissionEnum.StaffUser
  }
];
