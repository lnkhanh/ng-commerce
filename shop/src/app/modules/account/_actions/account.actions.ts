import { Action } from '@ngrx/store';
import { UserType } from '@app/modules/auth/_models/user.model';
import { UpdateAccountPayload } from '../_models/account.model';

export enum AccountActionTypes {
  UpdateAccount = '[ACCOUNT] Update Account',
  RemoveAvatar = '[ACCOUNT] Remove Account Avatar',
  UploadAvatar = '[ACCOUNT] Upload Account Avatar',

  ChangePassword = '[ACCOUNT] Change Account Password',
}

export class UpdateAccountAction implements Action {
  readonly type = AccountActionTypes.UpdateAccount;
  constructor(public payload: { data: UpdateAccountPayload }) { }
}

export class AccountChangePasswordAction implements Action {
  readonly type = AccountActionTypes.ChangePassword;

  constructor(public payload: { AccountId: string; password: string }) { }
}

export class UploadAvatarAction implements Action {
  readonly type = AccountActionTypes.UploadAvatar;

  constructor(public payload: { formData: FormData }) { }
}

export class RemoveAvatarAction implements Action {
  readonly type = AccountActionTypes.RemoveAvatar;

  constructor() { }
}

export type AccountActions =
  | UpdateAccountAction
  | AccountChangePasswordAction
  | UploadAvatarAction
  | RemoveAvatarAction;
