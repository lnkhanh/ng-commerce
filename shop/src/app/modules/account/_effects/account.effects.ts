import { Injectable } from '@angular/core';
import {
  mergeMap,
  map,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  AccountActionTypes,
  UpdateAccountAction,
  AccountChangePasswordAction,
  UploadAvatarAction,
  RemoveAvatarAction,
} from '../_actions/account.actions';
import {
  AddLoadingAction,
  RemoveLoadingAction,
} from '@shared/actions/loading.actions';
import { AccountService } from '../_services/account.service';
import { AppState } from '@app/shared/reducers';
import { ResponseStatus } from '@app/shared/models/common';
import { UserLoaded } from '@app/modules/auth';

@Injectable()
export class AccountEffects {

  @Effect()
  updateAccount$ = this.actions$.pipe(
    ofType<UpdateAccountAction>(AccountActionTypes.UpdateAccount),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: AccountActionTypes.UpdateAccount,
        })
      );
      return this.accountSvc.updateAccount(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: AccountActionTypes.UpdateAccount,
        })
      );

      if (!rs) {
        throw new Error('');
      }
      return new UserLoaded({ user: rs.data });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: AccountActionTypes.UpdateAccount,
        })
      );
      return caught;
    })
  );

  @Effect()
  changePassword$ = this.actions$.pipe(
    ofType<AccountChangePasswordAction>(AccountActionTypes.ChangePassword),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: AccountActionTypes.ChangePassword,
        })
      );
      return this.accountSvc.changePassword(payload.AccountId, payload.password);
    }),
    map((rs) => {
      if (!rs || rs.status === ResponseStatus.FAILED) {
        // TODO: show error message
      }
      return new RemoveLoadingAction({
        currentAction: AccountActionTypes.ChangePassword,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: AccountActionTypes.ChangePassword,
        })
      );
      return caught;
    })
  );

  @Effect()
  uploadAvatar$ = this.actions$.pipe(
    ofType<UploadAvatarAction>(AccountActionTypes.UploadAvatar),
    switchMap(({ payload }) => {
      return this.accountSvc.uploadAvatar(payload.formData);
    }),
    map(rs => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: AccountActionTypes.UploadAvatar,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new UserLoaded({ user: rs.data.user });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: AccountActionTypes.UploadAvatar,
        })
      );
      return caught;
    })
  );

  @Effect()
  removeAvatar$ = this.actions$.pipe(
    ofType<RemoveAvatarAction>(AccountActionTypes.RemoveAvatar),
    switchMap(() => {
      return this.accountSvc.removeAvatar();
    }),
    map(rs => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: AccountActionTypes.RemoveAvatar,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new UserLoaded({ user: rs.data.user });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: AccountActionTypes.RemoveAvatar,
        })
      );
      return caught;
    })
  );

  constructor(
    private actions$: Actions,
    private accountSvc: AccountService,
    private store: Store<AppState>
  ) { }
}
