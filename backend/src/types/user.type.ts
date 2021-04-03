import { Document, PaginateModel, Types } from "mongoose";

export type IUser<T extends Document> = PaginateModel<T>

export interface IUserModel extends Document {
  _id: Types.ObjectId;
  passwordResetLink?: string;
  resetPasswordToken?: string;
  authenticate: (password: string) => boolean;
  hashPassword: (password: string) => string;
  address?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  cover?: string;
  phone?: string;
  nick?: string;
  email: string;
  role: string;
  password: string;
  gender?: string;
  provider: string;
  needUpdatePassword?: boolean;
  providerData?: any;
  additionalProvidersData?: {
    [key: string]: string;
  };
  facebookProvider?: any;
  state: string;
  salt?: Buffer;
  companyId?: Types.ObjectId;
  storeId?: Types.ObjectId;
  lastVisitedStoreId?: Types.ObjectId;
  isActivate: boolean;
  createdAt: string;
  lastLogin: string;
}