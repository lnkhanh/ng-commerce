import { Document, PaginateModel, Types } from "mongoose";

export type IWishList<T extends Document> = PaginateModel<T>

export interface IWishListModel extends Document {
  id?: string;
  userId: Types.ObjectId;
  product: Types.ObjectId;
  createdAt?: string;
}
