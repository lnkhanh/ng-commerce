import { Document, PaginateModel } from "mongoose";

export type ICategory<T extends Document> = PaginateModel<T>

export interface ICategoryModel extends Document {
  id?: string;
  name: string;
  slug: string;
  isDeleted: boolean;
  modifiedAt?: string;
  createdAt?: string;
}
