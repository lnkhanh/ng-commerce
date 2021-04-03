import { Action } from '@ngrx/store';
import { RequestParamModel, ResponseData } from '@app/core/models/common';
import { OptionSet } from '@app/modules/e-commerce/_models/option-set.model';

export enum OptionSetActionTypes {
  FetchList = '[OptionSet] Fetch Option Set List',
  SaveList = '[OptionSet] Save Option Set List',

  SaveRequestParams = '[OptionSet] Save Request Params',

  CreateOptionSet = '[OptionSet] Create Option Set',
  CreateOptionSetSuccess = '[OptionSet] Create Option Set Success',

  FetchOptionSetDetails = '[OptionSet] Fetch Option Set Details',
  UpdateOptionSet = '[OptionSet] Update Option Set',
  SaveOptionSetDetails = '[OptionSet] Save Option Set Details',

  RemoveOptionSet = '[OptionSet] Remove Option Set',
  RemoveOptionSetSuccess = '[OptionSet] Remove Option Set Success',
}

export class FetchOptionSetListAction implements Action {
  readonly type = OptionSetActionTypes.FetchList;

  constructor() { }
}

export class SaveOptionSetListAction implements Action {
  readonly type = OptionSetActionTypes.SaveList;

  constructor(public payload: { response: ResponseData }) { }
}

export class SaveRequestParamsAction implements Action {
  readonly type = OptionSetActionTypes.SaveRequestParams;
  constructor(public payload: { params: RequestParamModel }) { }
}

export class CreateOptionSetAction implements Action {
  readonly type = OptionSetActionTypes.CreateOptionSet;
  constructor(public payload: OptionSet) { }
}

export class CreateOptionSetSuccessAction implements Action {
  readonly type = OptionSetActionTypes.CreateOptionSetSuccess;
  constructor(public payload: { optionSet: OptionSet }) { }
}

export class FetchOptionSetDetailsAction implements Action {
  readonly type = OptionSetActionTypes.FetchOptionSetDetails;
  constructor(public payload: { optionSetId: string }) { }
}

export class UpdateOptionSetAction implements Action {
  readonly type = OptionSetActionTypes.UpdateOptionSet;
  constructor(public payload: OptionSet) { }
}

export class SaveCurrentOptionSetAction implements Action {
  readonly type = OptionSetActionTypes.SaveOptionSetDetails;
  constructor(public payload: { optionSet: OptionSet }) { }
}

export class RemoveOptionSetAction implements Action {
  readonly type = OptionSetActionTypes.RemoveOptionSet;
  constructor(public payload: { optionSetId: string }) { }
}

export class RemoveOptionSetSuccessAction implements Action {
  readonly type = OptionSetActionTypes.RemoveOptionSetSuccess;
  constructor(public payload: { isSuccess: boolean }) { }
}

export type OptionSetActions =
  | FetchOptionSetListAction
  | SaveOptionSetListAction
  | SaveRequestParamsAction
  | CreateOptionSetAction
  | CreateOptionSetSuccessAction
  | FetchOptionSetDetailsAction
  | UpdateOptionSetAction
  | SaveCurrentOptionSetAction
  | RemoveOptionSetAction
  | RemoveOptionSetSuccessAction;
