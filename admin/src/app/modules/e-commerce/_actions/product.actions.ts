import { Action } from '@ngrx/store';
import { RequestParamModel, ResponseData } from '@app/core/models/common';
import { ProductType } from '@app/modules/e-commerce/_models/product.model';

export enum ProductActionTypes {
  FetchList = '[PRODUCT] Fetch Product List',
  SaveList = '[PRODUCT] Save Product List',

  SaveRequestParams = '[PRODUCT] Save Request Params',

  CreateProduct = '[PRODUCT] Create Product',
  CreateProductSuccess = '[PRODUCT] Create Product Success',

  FetchProductDetails = '[PRODUCT] Fetch Product Details',
  UpdateProduct = '[PRODUCT] Update Product',
  SaveProductDetails = '[PRODUCT] Save Product Details',
  UploadProductPhotos = '[PRODUCT] Upload Product Photos',

  ArchiveProduct = '[PRODUCT] Archive Product',
  ArchiveProductSuccess = '[PRODUCT] Archive Product Success',
}

export class FetchListAction implements Action {
  readonly type = ProductActionTypes.FetchList;

  constructor() { }
}

export class SaveListAction implements Action {
  readonly type = ProductActionTypes.SaveList;

  constructor(public payload: { response: ResponseData }) { }
}

export class SaveRequestParamsAction implements Action {
  readonly type = ProductActionTypes.SaveRequestParams;
  constructor(public payload: { params: RequestParamModel }) { }
}

export class CreateProductAction implements Action {
  readonly type = ProductActionTypes.CreateProduct;
  constructor(public payload: { data: ProductType }) { }
}

export class CreateProductSuccessAction implements Action {
  readonly type = ProductActionTypes.CreateProductSuccess;
  constructor(public payload: { product: ProductType }) { }
}

export class FetchProductDetailsAction implements Action {
  readonly type = ProductActionTypes.FetchProductDetails;
  constructor(public payload: { productId: string }) { }
}

export class UpdateProductAction implements Action {
  readonly type = ProductActionTypes.UpdateProduct;
  constructor(public payload: { data: ProductType }) { }
}

export class SaveCurrentProductAction implements Action {
  readonly type = ProductActionTypes.SaveProductDetails;
  constructor(public payload: { product: ProductType }) { }
}

export class ArchiveProductAction implements Action {
  readonly type = ProductActionTypes.ArchiveProduct;
  constructor(public payload: { productId: string }) { }
}

export class ArchiveProductSuccessAction implements Action {
  readonly type = ProductActionTypes.ArchiveProductSuccess;
  constructor(public payload: { isSuccess: boolean }) { }
}

export class UploadProductPhotosAction implements Action {
  readonly type = ProductActionTypes.UploadProductPhotos;

  constructor(public payload: { productId: string, formData: FormData }) { }
}

export type ProductActions =
  | FetchListAction
  | SaveListAction
  | SaveRequestParamsAction
  | CreateProductAction
  | CreateProductSuccessAction
  | FetchProductDetailsAction
  | UpdateProductAction
  | SaveCurrentProductAction
  | ArchiveProductAction
  | ArchiveProductSuccessAction
  | UploadProductPhotosAction;
