import { Document, PaginateModel } from "mongoose";

export type ICartItem<T extends Document> = PaginateModel<T>;

export type CartItemType = {
  id: string;
  storeId: string;
  tableName: string;
  productId: string;
  title: string;
  image: string;
  quantity: number;
  note: string;
  availableQuantity: number;
  retailPrice: number;
  salePrice: number;
  slug: string;
  categoryId: string;
  categoryName: string;
  errorMessage?: string;
};

export interface ICartItemModel extends Document {
  _id: string;
  product: string;
  retailPrice: number;
  salePrice: number;
  title: string;
  variationId: string;
  image: string;
  quantity: number;
  user: string;
  note: string;
  categoryId: string;
  categoryName: string;
  isVirtual?: boolean;
  saleCountry?: string;
  shippingOptionAt?: string;
}
