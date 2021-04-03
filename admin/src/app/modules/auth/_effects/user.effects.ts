// Angular
import { Injectable } from '@angular/core';
// RxJS
import {
  mergeMap,
  map,
  switchMap,
  withLatestFrom,
  catchError,
} from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
// Services
import { AuthService } from '@app/modules/auth/_services';
// State
import { AppState } from '@core/reducers';
import {
  UserActionTypes,
  FetchListAction,
  FetchUserDetailsAction,
  SaveListAction,
  ArchiveUserAction,
  ArchiveUserSuccessAction,
  CreateUserAction,
  CreateUserSuccessAction,
  SaveCurrentUserAction,
  UpdateUserAction,
  UserChangePasswordAction,
  UploadAvatarAction,
  RemoveAvatarAction,
} from '../_actions/user.actions';
import { selectPagination } from '../_selectors/user.selectors';
import { RequestParamModel, ResponseStatus } from '@app/core/models/common';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import {
  AddLoadingAction,
  RemoveLoadingAction,
} from '@app/core/actions/loading.actions';

@Injectable()
export class UserEffects {
  @Effect()
  fetchList$ = this.actions$.pipe(
    ofType<FetchListAction>(UserActionTypes.FetchList),
    withLatestFrom(this.store.pipe(select(selectPagination()))),
    switchMap(([_, pagination]) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: UserActionTypes.FetchList })
      );

      const params = new RequestParamModel();
      params.pageIndex = pagination.pageIndex;
      params.pageSize = pagination.pageSize;
      params.keyword = pagination.keyword;

      return this.auth.fetchUserList(params);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({ currentAction: UserActionTypes.FetchList })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveListAction({ response: rs.data });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      this.store.dispatch(
        new RemoveLoadingAction({ currentAction: UserActionTypes.FetchList })
      );
      return caught;
    })
  );

  @Effect()
  fetchUserDetails = this.actions$.pipe(
    ofType<FetchUserDetailsAction>(UserActionTypes.FetchUserDetails),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: UserActionTypes.FetchUserDetails,
        })
      );

      return this.auth.fetchUserById(payload.userId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: UserActionTypes.FetchUserDetails,
        })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveCurrentUserAction({ user: rs.data.user });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: UserActionTypes.FetchUserDetails,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  deleteUser$ = this.actions$.pipe(
    ofType<ArchiveUserAction>(UserActionTypes.ArchiveUser),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: UserActionTypes.ArchiveUser })
      );
      return this.auth.archiveUser(payload.userId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({ currentAction: UserActionTypes.ArchiveUser })
      );
      if (!rs) {
        throw new Error('');
      }

      this.store.dispatch(new FetchListAction());
      return new ArchiveUserSuccessAction({
        isSuccess: rs.status === ResponseStatus.SUCCESS,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({ currentAction: UserActionTypes.ArchiveUser })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  updateUser$ = this.actions$.pipe(
    ofType<UpdateUserAction>(UserActionTypes.UpdateUser),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: UserActionTypes.UpdateUser })
      );
      return this.auth.updateUser(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({ currentAction: UserActionTypes.UpdateUser })
      );

      if (!rs) {
        throw new Error('');
      }
      return new SaveCurrentUserAction({ user: rs.data.user });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({ currentAction: UserActionTypes.ArchiveUser })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  createUser$ = this.actions$.pipe(
    ofType<CreateUserAction>(UserActionTypes.CreateUser),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: UserActionTypes.CreateUser })
      );

      return this.auth.createUser(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({ currentAction: UserActionTypes.CreateUser })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new CreateUserSuccessAction({ user: rs.data.user });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  changePassword$ = this.actions$.pipe(
    ofType<UserChangePasswordAction>(UserActionTypes.ChangePassword),
    mergeMap(({ payload }) => {
      this.store.dispatch(new AddLoadingAction({ currentAction: UserActionTypes.ChangePassword }));
      return this.auth.changePassword(payload.userId, payload.password);
    }),
    map((rs) => {
      if (!rs || rs.status === ResponseStatus.FAILED) {
        // TODO: show error message
      }
      return new RemoveLoadingAction({
        currentAction: UserActionTypes.ChangePassword,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: UserActionTypes.ChangePassword,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  uploadAvatar$ = this.actions$.pipe(
    ofType<UploadAvatarAction>(UserActionTypes.UploadAvatar),
    switchMap(({ payload }) => {
      return this.auth.uploadAvatar(payload.userId, payload.formData);
    }),
    map(rs => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: UserActionTypes.UploadAvatar,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new SaveCurrentUserAction({ user: rs.data.user });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: UserActionTypes.UploadAvatar,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  removeAvatar$ = this.actions$.pipe(
    ofType<RemoveAvatarAction>(UserActionTypes.RemoveAvatar),
    switchMap(({ payload }) => {
      return this.auth.removeAvatar(payload.userId);
    }),
    map(rs => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: UserActionTypes.RemoveAvatar,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new SaveCurrentUserAction({ user: rs.data.user });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: UserActionTypes.RemoveAvatar,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private store: Store<AppState>,
    private toastService: ToastService
  ) { }
}
