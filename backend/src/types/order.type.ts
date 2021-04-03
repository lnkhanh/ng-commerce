import { IAccountModel } from '@src/types/account.type';
import { CartItemType } from '@src/types/cart-item.type';
import { Document, PaginateModel, Types } from "mongoose";

export type IOrder<T extends Document> = PaginateModel<T>;

export interface IOrderModel extends Document {
  _id: Types.ObjectId;
  code: string;
  storeId: string;
  storeName: string;
  tableName: string;
  user: any; // TODO: Legacy type - IUserModel|string;
  address: string;
  status: number;
  products: Array<CartItemType>;
  note: string;
  createdDate: string;
  displayMessage?: string;
  createdTimestamp: number;
  shippedDate?: string;
  isFirstOrder?: boolean;
  metadata?: any;
  isDeleted: boolean;
  source: OrderSource;
  // Customer
  customerId: any;
  phone: number;
  firstName: string;
  lastName: string;
  email: string;
}

export type PaymentSummary = {
  method: string;
  subtotal: number;
  currency?: string;
  total: number;
};

export type CheckoutOrder = {
  id: string;
  code: string;
  user: IAccountModel;
  products: Array<CartItemType>;
  address: string;
};

export type OrderedProduct = {
  id: string;
  title: string;
  image: string;
  retailPrice: number;
  salePrice: number;
  quantity: number;
  slug?: string;
  categoryId: string;
  categoryName: string;
};

export type Order = {
  id: string;
  code: string;
  user: IAccountModel;
  address: string;
  status: number;
  products: Array<CartItemType>;
  note: string;
  createdDate: string;
  displayMessage?: string;
  createdTimestamp: number;
  shippedDate?: string;
  isFirstOrder?: boolean;
  metadata?: any;
  source: number;
  // Customer
  customer: {
    id: string;
    phone: number;
    firstName: string;
    lastName: string;
    email: string;
  }
};

export type CreateOrder = {
  code: string;
  user: string;
  address: string;
  products: Array<CartItemType>;
  paymentSummary?: PaymentSummary;
  metadata?: any;
  storeId: string;
  storeName: string;
  tableName: string;
  note: string;
  // Customer
  customerId: string;
  phone: number;
  firstName: string;
  lastName: string;
  email: string;
  source: OrderSource;
};

export type OrderSummary = {
  id: string;
  code: string;
  storeId: string,
  storeName: string,
  tableName: string,
  createdDate: string;
  eventDate?: string;
  displayMessage?: string;
  status: number;
  note: string;
  // Customer
  customerId: string;
  phone: number;
  firstName: string;
  lastName: string;
  email: string;
};

export enum OrderStatuses {
	Failed = -1,
	New = 0,
	Preparing = 1,
	Shipping = 2,
	Ready = 3,
	Completed = 4,
	Cancelled = 5
}

export enum OrderSource {
  WEB_ADMIN,
	APP_ADMIN,
  FRONT_SITE
}