import { Action } from '@ngrx/store';
import { RequestParamModel, ResponseData } from '@app/core/models/common';
import { StoreTablePayload, StoreTableType, StoreType } from '@app/modules/e-commerce/_models/store.model';

export enum StoreActionTypes {
  FetchList = '[Store] Fetch Store List',
  SaveList = '[Store] Save Store List',

	FetchAllStores = '[STORE] Fetch All Stores',
	SaveAllStoreList = '[STORE] Save All Stores',

  SaveRequestParams = '[Store] Save Request Params',

  CreateStore = '[Store] Create Store',
  CreateStoreSuccess = '[Store] Create Store Success',

  FetchStoreDetails = '[Store] Fetch Store Details',
  UpdateStore = '[Store] Update Store',
  SaveStoreDetails = '[Store] Save Store Details',

  ArchiveStore = '[Store] Archive Store',
  ArchiveStoreSuccess = '[Store] Archive Store Success',

  // Store Table
  FetchStoreTableList = '[Store Table] Fetch Store Table List',
  SaveStoreTableList = '[Store Table] Save Store Table List',

  SaveStoreTableRequestParams = '[Store Table] Save Store Table Request Params',

  CreateStoreTable = '[Store Table] Create Store Table',
  UpdateStoreTable = '[Store Table] Update Store Table',
  SaveStoreTable = '[Store Table] Save Store Table',

  RemoveStoreTable = '[Store Table] Remove Store Table',
  RemoveStoreTableSuccess = '[Store Table] Remove Store Table Success',
}

export class FetchStoreListAction implements Action {
  readonly type = StoreActionTypes.FetchList;

  constructor() { }
}

export class SaveListAction implements Action {
  readonly type = StoreActionTypes.SaveList;

  constructor(public payload: { response: ResponseData }) { }
}

export class FetchAllStoresAction implements Action {
	readonly type = StoreActionTypes.FetchAllStores;

	constructor() { }
}

export class SaveAllStoresAction implements Action {
	readonly type = StoreActionTypes.SaveAllStoreList;

	constructor(public payload: { response: StoreType[] }) { }
}

export class SaveRequestParamsAction implements Action {
  readonly type = StoreActionTypes.SaveRequestParams;
  constructor(public payload: { params: RequestParamModel }) { }
}

export class CreateStoreAction implements Action {
  readonly type = StoreActionTypes.CreateStore;
  constructor(public payload: { data: StoreType }) { }
}

export class CreateStoreSuccessAction implements Action {
  readonly type = StoreActionTypes.CreateStoreSuccess;
  constructor(public payload: { store: StoreType }) { }
}

export class FetchStoreDetailsAction implements Action {
  readonly type = StoreActionTypes.FetchStoreDetails;
  constructor(public payload: { storeId: string }) { }
}

export class UpdateStoreAction implements Action {
  readonly type = StoreActionTypes.UpdateStore;
  constructor(public payload: { data: StoreType }) { }
}

export class SaveCurrentStoreAction implements Action {
  readonly type = StoreActionTypes.SaveStoreDetails;
  constructor(public payload: { store: StoreType }) { }
}

export class ArchiveStoreAction implements Action {
  readonly type = StoreActionTypes.ArchiveStore;
  constructor(public payload: { storeId: string }) { }
}

export class ArchiveStoreSuccessAction implements Action {
  readonly type = StoreActionTypes.ArchiveStoreSuccess;
  constructor(public payload: { isSuccess: boolean }) { }
}

// Store Table
export class FetchStoreTableListAction implements Action {
  readonly type = StoreActionTypes.FetchStoreTableList;

  constructor(public payload: { storeId: string }) { }
}

export class SaveStoreTableListAction implements Action {
  readonly type = StoreActionTypes.SaveStoreTableList;

  constructor(public payload: { response: ResponseData }) { }
}

export class SaveStoreTableRequestParamsAction implements Action {
  readonly type = StoreActionTypes.SaveStoreTableRequestParams;
  constructor(public payload: { params: RequestParamModel }) { }
}

export class CreateStoreTableAction implements Action {
  readonly type = StoreActionTypes.CreateStoreTable;
  constructor(public payload: { data: StoreTablePayload }) { }
}

export class CreateStoreTableSuccessAction implements Action {
  readonly type = StoreActionTypes.CreateStoreTable;
  constructor(public payload: StoreTableType) { }
}

export class UpdateStoreTableAction implements Action {
  readonly type = StoreActionTypes.UpdateStoreTable;
  constructor(public payload: { tableId: string, storeId: string, name: string }) { }
}

export class SaveCurrentStoreTableAction implements Action {
  readonly type = StoreActionTypes.SaveStoreTable;
  constructor(public payload: { storeTable: StoreTableType }) { }
}

export class RemoveStoreTableAction implements Action {
  readonly type = StoreActionTypes.RemoveStoreTable;
  constructor(public payload: { storeId: string, tableId: string }) { }
}

export class RemoveStoreTableSuccessAction implements Action {
  readonly type = StoreActionTypes.RemoveStoreTableSuccess;
  constructor(public payload: { isSuccess: boolean }) { }
}

export type StoreActions =
  | FetchStoreListAction
  | SaveListAction
	| FetchAllStoresAction
	| SaveAllStoresAction
  | SaveRequestParamsAction
  | CreateStoreAction
  | CreateStoreSuccessAction
  | FetchStoreDetailsAction
  | UpdateStoreAction
  | SaveCurrentStoreAction
  | ArchiveStoreAction
  | ArchiveStoreSuccessAction
  | FetchStoreTableListAction
  | SaveStoreTableListAction
  | SaveStoreTableRequestParamsAction
  | CreateStoreTableAction
  | CreateStoreTableSuccessAction
  | UpdateStoreTableAction
  | SaveCurrentStoreTableAction
  | RemoveStoreTableAction
  | RemoveStoreTableSuccessAction;
