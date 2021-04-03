import { Document, PaginateModel, Types } from "mongoose";

export type IStoreTable<T extends Document> = PaginateModel<T>

export interface IStoreTableModel extends Document {
  id?: string;
  storeId: Types.ObjectId;
  name: string;
  modifiedAt?: string;
  createdAt?: string;
}
