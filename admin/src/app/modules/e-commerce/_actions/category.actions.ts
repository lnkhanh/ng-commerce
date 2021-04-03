import { Action } from '@ngrx/store';
import { RequestParamModel, ResponseData } from '@app/core/models/common';
import { CategoryType } from '@app/modules/e-commerce/_models/category.model';

export enum CategoryActionTypes {
  FetchCategoryList = '[CATEGORY] Fetch Category List',
  SaveList = '[CATEGORY] Save Category List',

  SaveRequestParams = '[CATEGORY] Save Request Params',

  CreateCategory = '[CATEGORY] Create Category',
  CreateCategorySuccess = '[CATEGORY] Create Category Success',

  FetchCategoryDetails = '[CATEGORY] Fetch Category Details',
  UpdateCategory = '[CATEGORY] Update Category',
  SaveCategoryDetails = '[CATEGORY] Save Category Details',

  ArchiveCategory = '[CATEGORY] Archive Category',
  ArchiveCategorySuccess = '[CATEGORY] Archive Category Success',
}

export class FetchCategoryListAction implements Action {
  readonly type = CategoryActionTypes.FetchCategoryList;

  constructor() {}
}

export class SaveListAction implements Action {
  readonly type = CategoryActionTypes.SaveList;

  constructor(public payload: { response: ResponseData }) {}
}

export class SaveRequestParamsAction implements Action {
  readonly type = CategoryActionTypes.SaveRequestParams;
  constructor(public payload: { params: RequestParamModel }) {}
}

export class CreateCategoryAction implements Action {
  readonly type = CategoryActionTypes.CreateCategory;
  constructor(public payload: { data: CategoryType }) {}
}

export class CreateCategorySuccessAction implements Action {
  readonly type = CategoryActionTypes.CreateCategorySuccess;
  constructor(public payload: { category: CategoryType }) {}
}

export class FetchCategoryDetailsAction implements Action {
  readonly type = CategoryActionTypes.FetchCategoryDetails;
  constructor(public payload: { categoryId: string }) {}
}

export class UpdateCategoryAction implements Action {
  readonly type = CategoryActionTypes.UpdateCategory;
  constructor(public payload: { data: CategoryType }) {}
}

export class SaveCurrentCategoryAction implements Action {
  readonly type = CategoryActionTypes.SaveCategoryDetails;
  constructor(public payload: { category: CategoryType }) {}
}

export class ArchiveCategoryAction implements Action {
  readonly type = CategoryActionTypes.ArchiveCategory;
  constructor(public payload: { categoryId: string }) {}
}

export class ArchiveCategorySuccessAction implements Action {
  readonly type = CategoryActionTypes.ArchiveCategorySuccess;
  constructor(public payload: { isSuccess: boolean }) {}
}

export type CategoryActions =
  | FetchCategoryListAction
  | SaveListAction
  | SaveRequestParamsAction
  | CreateCategoryAction
  | CreateCategorySuccessAction
  | FetchCategoryDetailsAction
  | UpdateCategoryAction
  | SaveCurrentCategoryAction
  | ArchiveCategoryAction
  | ArchiveCategorySuccessAction;
