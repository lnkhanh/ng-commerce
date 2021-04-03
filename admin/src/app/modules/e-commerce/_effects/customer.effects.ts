import { Injectable } from '@angular/core';
import {
  mergeMap,
  map,
  switchMap,
  withLatestFrom,
  catchError,
} from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
import { AppState } from '@core/reducers';
import {
  CustomerActionTypes,
  FetchListAction,
  FetchCustomerDetailsAction,
  SaveListAction,
  ArchiveCustomerAction,
  ArchiveCustomerSuccessAction,
  CreateCustomerAction,
  CreateCustomerSuccessAction,
  SaveCurrentCustomerAction,
  UpdateCustomerAction,
  CustomerChangePasswordAction,
  UploadAvatarAction,
  RemoveAvatarAction,
} from '../_actions/customer.actions';
import { selectCustomerPagination } from '../_selectors/customer.selectors';
import { RequestParamModel, ResponseStatus } from '@app/core/models/common';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import {
  AddLoadingAction,
  RemoveLoadingAction,
} from '@app/core/actions/loading.actions';
import { CustomerService } from '../_services';

@Injectable()
export class CustomerEffects {
  @Effect()
  fetchList$ = this.actions$.pipe(
    ofType<FetchListAction>(CustomerActionTypes.FetchList),
    withLatestFrom(this.store.pipe(select(selectCustomerPagination()))),
    switchMap(([_, pagination]) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: CustomerActionTypes.FetchList })
      );

      const params = new RequestParamModel();
      params.pageIndex = pagination.pageIndex;
      params.pageSize = pagination.pageSize;
      params.keyword = pagination.keyword;

      return this.customerSvc.fetchCustomerList(params);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.FetchList,
        })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveListAction({ response: rs.data });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.FetchList,
        })
      );
      return caught;
    })
  );

  @Effect()
  fetchCustomerDetails = this.actions$.pipe(
    ofType<FetchCustomerDetailsAction>(
      CustomerActionTypes.FetchCustomerDetails
    ),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: CustomerActionTypes.FetchCustomerDetails,
        })
      );

      return this.customerSvc.fetchCustomerById(payload.customerId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.FetchCustomerDetails,
        })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveCurrentCustomerAction({ customer: rs.data.user });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.FetchCustomerDetails,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  deleteCustomer$ = this.actions$.pipe(
    ofType<ArchiveCustomerAction>(CustomerActionTypes.ArchiveCustomer),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: CustomerActionTypes.ArchiveCustomer,
        })
      );
      return this.customerSvc.archiveCustomer(payload.customerId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.ArchiveCustomer,
        })
      );
      if (!rs) {
        throw new Error('');
      }

      this.store.dispatch(new FetchListAction());
      return new ArchiveCustomerSuccessAction({
        isSuccess: rs.status === ResponseStatus.SUCCESS,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.ArchiveCustomer,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  updateCustomer$ = this.actions$.pipe(
    ofType<UpdateCustomerAction>(CustomerActionTypes.UpdateCustomer),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: CustomerActionTypes.UpdateCustomer,
        })
      );
      return this.customerSvc.updateCustomer(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.UpdateCustomer,
        })
      );

      if (!rs) {
        throw new Error('');
      }
      return new SaveCurrentCustomerAction({ customer: rs.data.user });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.ArchiveCustomer,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  createCustomer$ = this.actions$.pipe(
    ofType<CreateCustomerAction>(CustomerActionTypes.CreateCustomer),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: CustomerActionTypes.CreateCustomer,
        })
      );

      return this.customerSvc.createCustomer(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.CreateCustomer,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new CreateCustomerSuccessAction({ customer: rs.data.user });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.CreateCustomer,
        })
      );
      return caught;
    })
  );

  @Effect()
  changePassword$ = this.actions$.pipe(
    ofType<CustomerChangePasswordAction>(CustomerActionTypes.ChangePassword),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: CustomerActionTypes.ChangePassword,
        })
      );
      return this.customerSvc.changePassword(payload.customerId, payload.password);
    }),
    map((rs) => {
      if (!rs || rs.status === ResponseStatus.FAILED) {
        // TODO: show error message
      }
      return new RemoveLoadingAction({
        currentAction: CustomerActionTypes.ChangePassword,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.ChangePassword,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  uploadAvatar$ = this.actions$.pipe(
    ofType<UploadAvatarAction>(CustomerActionTypes.UploadAvatar),
    switchMap(({ payload }) => {
      return this.customerSvc.uploadAvatar(payload.userId, payload.formData);
    }),
    map(rs => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.UploadAvatar,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new SaveCurrentCustomerAction({ customer: rs.data.user });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.UploadAvatar,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  removeAvatar$ = this.actions$.pipe(
    ofType<RemoveAvatarAction>(CustomerActionTypes.RemoveAvatar),
    switchMap(({ payload }) => {
      return this.customerSvc.removeAvatar(payload.userId);
    }),
    map(rs => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.RemoveAvatar,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new SaveCurrentCustomerAction({ customer: rs.data.user });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CustomerActionTypes.RemoveAvatar,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  constructor(
    private actions$: Actions,
    private customerSvc: CustomerService,
    private store: Store<AppState>,
    private toastService: ToastService
  ) {}
}
