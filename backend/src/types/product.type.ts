import { Document, PaginateModel, Types } from "mongoose";
import { OptionSet } from './option-set.type';

export type IProduct<T extends Document> = PaginateModel<T>;

export interface IProductModel extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  category: string;
  salePrice: number;
  retailPrice: number;
  images: string[];
  isDeleted: boolean;
  store: string;
  optionSets: string;
  dimension: string;
}

export type AddProductType = {
  name: string,
  description: string,
  retailPrice: string,
  salePrice: string,
  category: string,
  store?: string;
};

export type ProductDimension = {
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
}
