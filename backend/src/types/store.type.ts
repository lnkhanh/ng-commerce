import { Document, PaginateModel, Types } from "mongoose";

export type IStore<T extends Document> = PaginateModel<T>

export interface IStoreModel extends Document {
  id?: string;
  companyId: Types.ObjectId;
  name: string;
  address: string;
  createdBy: Types.ObjectId;
  modifiedAt?: string;
  createdAt?: string;
}
