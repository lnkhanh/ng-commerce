import { BaseModel } from '@app/core/views/crud';
import { Address } from './address.model';
import { SocialNetworks } from './social-networks.model';

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

export class User extends BaseModel {
  id: number;
  username: string;
  password: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  roles: number[];
  pic: string;
  fullname: string;
  occupation: string;
  companyName: string;
  phone: string;
  address: Address;
  socialNetworks: SocialNetworks;

  clear(): void {
    this.id = undefined;
    this.username = '';
    this.password = '';
    this.email = '';
    this.roles = [];
    this.fullname = '';
    this.accessToken = 'access-token-' + Math.random();
    this.refreshToken = 'access-token-' + Math.random();
    this.pic = './assets/media/users/default.jpg';
    this.occupation = '';
    this.companyName = '';
    this.phone = '';
    this.address = new Address();
    this.address.clear();
    this.socialNetworks = new SocialNetworks();
    this.socialNetworks.clear();
  }
}
