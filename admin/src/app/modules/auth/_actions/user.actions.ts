import { Action } from '@ngrx/store';
import { UserType } from '../_models/user.model';
import { RequestParamModel, ResponseData } from '@app/core/models/common';

export enum UserActionTypes {
  FetchList = '[USER] Fetch User List',
  SaveList = '[USER] Save User List',

  SaveRequestParams = '[User] Save Request Params',

  CreateUser = '[User] Create User',
  CreateUserSuccess = '[User] Create User Success',

  FetchUserDetails = '[User] Fetch User Details',
  UpdateUser = '[User] Update User',
  RemoveAvatar = '[User] Remove Customer Avatar',
  UploadAvatar = '[User] Upload Customer Avatar',
  SaveUserDetails = '[User] Save User Details',

  ArchiveUser = '[User] Archive User',
  ArchiveUserSuccess = '[User] Archive User Success',

  ChangePassword = '[User] Change User Password',
}

export class FetchListAction implements Action {
  readonly type = UserActionTypes.FetchList;

  constructor() { }
}

export class SaveListAction implements Action {
  readonly type = UserActionTypes.SaveList;

  constructor(public payload: { response: ResponseData }) { }
}

export class SaveRequestParamsAction implements Action {
  readonly type = UserActionTypes.SaveRequestParams;
  constructor(public payload: { params: RequestParamModel }) { }
}

export class CreateUserAction implements Action {
  readonly type = UserActionTypes.CreateUser;
  constructor(public payload: { data: UserType }) { }
}

export class CreateUserSuccessAction implements Action {
  readonly type = UserActionTypes.CreateUserSuccess;
  constructor(public payload: { user: UserType }) { }
}

export class FetchUserDetailsAction implements Action {
  readonly type = UserActionTypes.FetchUserDetails;
  constructor(public payload: { userId: string }) { }
}

export class UpdateUserAction implements Action {
  readonly type = UserActionTypes.UpdateUser;
  constructor(public payload: { data: UserType }) { }
}

export class SaveCurrentUserAction implements Action {
  readonly type = UserActionTypes.SaveUserDetails;
  constructor(public payload: { user: UserType }) { }
}

export class ArchiveUserAction implements Action {
  readonly type = UserActionTypes.ArchiveUser;
  constructor(public payload: { userId: string }) { }
}

export class ArchiveUserSuccessAction implements Action {
  readonly type = UserActionTypes.ArchiveUserSuccess;
  constructor(public payload: { isSuccess: boolean }) { }
}

export class UserChangePasswordAction implements Action {
  readonly type = UserActionTypes.ChangePassword;

  constructor(public payload: { userId: string; password: string }) { }
}

export class UploadAvatarAction implements Action {
  readonly type = UserActionTypes.UploadAvatar;

  constructor(public payload: { userId: string, formData: FormData }) { }
}

export class RemoveAvatarAction implements Action {
  readonly type = UserActionTypes.RemoveAvatar;

  constructor(public payload: { userId: string }) { }
}

export type UserActions =
  | FetchListAction
  | SaveListAction
  | SaveRequestParamsAction
  | CreateUserAction
  | CreateUserSuccessAction
  | FetchUserDetailsAction
  | UpdateUserAction
  | SaveCurrentUserAction
  | ArchiveUserAction
  | ArchiveUserSuccessAction
  | UserChangePasswordAction
  | UploadAvatarAction
  | RemoveAvatarAction;
