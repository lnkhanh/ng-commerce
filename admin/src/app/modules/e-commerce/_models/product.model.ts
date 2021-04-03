export interface ProductType {
  id?: string;
  name: string;
  description: string;
  salePrice?: number;
  retailPrice: number;
  images?: string[];
  // storeId?: string;
  categoryId: string;
  isDeleted?: boolean;
}
