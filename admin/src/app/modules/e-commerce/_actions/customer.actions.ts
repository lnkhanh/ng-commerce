import { Action } from '@ngrx/store';
import { RequestParamModel, ResponseData } from '@app/core/models/common';
import { UserType } from '@app/modules/auth/_models/user.model';

export enum CustomerActionTypes {
  FetchList = '[CUSTOMER] Fetch Customer List',
  SaveList = '[CUSTOMER] Save Customer List',

  SaveRequestParams = '[CUSTOMER] Save Request Params',

  CreateCustomer = '[CUSTOMER] Create Customer',
  CreateCustomerSuccess = '[CUSTOMER] Create Customer Success',

  FetchCustomerDetails = '[CUSTOMER] Fetch Customer Details',
  UpdateCustomer = '[CUSTOMER] Update Customer',
  RemoveAvatar = '[CUSTOMER] Remove Customer Avatar',
  UploadAvatar = '[CUSTOMER] Upload Customer Avatar',
  SaveCustomerDetails = '[CUSTOMER] Save Customer Details',

  ArchiveCustomer = '[CUSTOMER] Archive Customer',
  ArchiveCustomerSuccess = '[CUSTOMER] Archive Customer Success',

  ChangePassword = '[CUSTOMER] Change Customer Password',
}

export class FetchListAction implements Action {
  readonly type = CustomerActionTypes.FetchList;

  constructor() { }
}

export class SaveListAction implements Action {
  readonly type = CustomerActionTypes.SaveList;

  constructor(public payload: { response: ResponseData }) { }
}

export class SaveRequestParamsAction implements Action {
  readonly type = CustomerActionTypes.SaveRequestParams;
  constructor(public payload: { params: RequestParamModel }) { }
}

export class CreateCustomerAction implements Action {
  readonly type = CustomerActionTypes.CreateCustomer;
  constructor(public payload: { data: UserType }) { }
}

export class CreateCustomerSuccessAction implements Action {
  readonly type = CustomerActionTypes.CreateCustomerSuccess;
  constructor(public payload: { customer: UserType }) { }
}

export class FetchCustomerDetailsAction implements Action {
  readonly type = CustomerActionTypes.FetchCustomerDetails;
  constructor(public payload: { customerId: string }) { }
}

export class UpdateCustomerAction implements Action {
  readonly type = CustomerActionTypes.UpdateCustomer;
  constructor(public payload: { data: UserType }) { }
}

export class SaveCurrentCustomerAction implements Action {
  readonly type = CustomerActionTypes.SaveCustomerDetails;
  constructor(public payload: { customer: UserType }) { }
}

export class ArchiveCustomerAction implements Action {
  readonly type = CustomerActionTypes.ArchiveCustomer;
  constructor(public payload: { customerId: string }) { }
}

export class ArchiveCustomerSuccessAction implements Action {
  readonly type = CustomerActionTypes.ArchiveCustomerSuccess;
  constructor(public payload: { isSuccess: boolean }) { }
}

export class CustomerChangePasswordAction implements Action {
  readonly type = CustomerActionTypes.ChangePassword;

  constructor(public payload: { customerId: string; password: string }) { }
}

export class UploadAvatarAction implements Action {
  readonly type = CustomerActionTypes.UploadAvatar;

  constructor(public payload: { userId: string, formData: FormData }) { }
}

export class RemoveAvatarAction implements Action {
  readonly type = CustomerActionTypes.RemoveAvatar;

  constructor(public payload: { userId: string }) { }
}

export type CustomerActions =
  | FetchListAction
  | SaveListAction
  | SaveRequestParamsAction
  | CreateCustomerAction
  | CreateCustomerSuccessAction
  | FetchCustomerDetailsAction
  | UpdateCustomerAction
  | SaveCurrentCustomerAction
  | ArchiveCustomerAction
  | ArchiveCustomerSuccessAction
  | CustomerChangePasswordAction
  | UploadAvatarAction
  | RemoveAvatarAction;
