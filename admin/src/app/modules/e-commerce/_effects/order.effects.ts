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
  OrderActionTypes,
  FetchOrderListAction,
  FetchOrderDetailsAction,
  SaveListAction,
  ArchiveOrderAction,
  ArchiveOrderSuccessAction,
  CreateOrderAction,
  CreateOrderSuccessAction,
  SaveCurrentOrderAction,
  UpdateOrderAction,
  UpdateOrderStatusAction,
  UpdateOrderStatusSuccessAction
} from '../_actions/order.actions';
import { selectOrderPagination } from '../_selectors/order.selectors';
import { RequestParamModel, ResponseStatus } from '@app/core/models/common';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import {
  AddLoadingAction,
  RemoveLoadingAction,
} from '@app/core/actions/loading.actions';
import { OrderService } from '../_services';

@Injectable()
export class OrderEffects {
  @Effect()
  fetchList$ = this.actions$.pipe(
    ofType<FetchOrderListAction>(OrderActionTypes.FetchOrderList),
    withLatestFrom(this.store.pipe(select(selectOrderPagination()))),
    switchMap(([_, pagination]) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: OrderActionTypes.FetchOrderList })
      );

      const params = new RequestParamModel();
      params.pageIndex = pagination.pageIndex;
      params.pageSize = pagination.pageSize;
      params.keyword = pagination.keyword;

      return this.orderSvc.fetchOrderList(params);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OrderActionTypes.FetchOrderList,
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
          currentAction: OrderActionTypes.FetchOrderList,
        })
      );
      return caught;
    })
  );

  @Effect()
  fetchOrderDetails = this.actions$.pipe(
    ofType<FetchOrderDetailsAction>(
      OrderActionTypes.FetchOrderDetails
    ),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: OrderActionTypes.FetchOrderDetails,
        })
      );

      return this.orderSvc.fetchOrderById(payload.orderId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OrderActionTypes.FetchOrderDetails,
        })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveCurrentOrderAction({ order: rs.data });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OrderActionTypes.FetchOrderDetails,
        })
      );

      let errorMsg = 'Ops! Something went wrong.';

      if (error && error.error && error.error.message) {
        errorMsg = error.error.message;
      }

      this.toastService.showDanger(errorMsg);
      return caught;
    })
  );

  @Effect()
  deleteOrder$ = this.actions$.pipe(
    ofType<ArchiveOrderAction>(OrderActionTypes.ArchiveOrder),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: OrderActionTypes.ArchiveOrder,
        })
      );
      return this.orderSvc.archiveOrder(payload.orderId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OrderActionTypes.ArchiveOrder,
        })
      );
      if (!rs) {
        throw new Error('');
      }

      this.store.dispatch(new FetchOrderListAction());
      return new ArchiveOrderSuccessAction({
        isSuccess: rs.status === ResponseStatus.SUCCESS,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OrderActionTypes.ArchiveOrder,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  updateOrder$ = this.actions$.pipe(
    ofType<UpdateOrderAction>(OrderActionTypes.UpdateOrder),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: OrderActionTypes.UpdateOrder,
        })
      );
      return this.orderSvc.updateOrder(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OrderActionTypes.UpdateOrder,
        })
      );

      if (!rs) {
        throw new Error('');
      }
      this.store.dispatch(new FetchOrderListAction());
      return new SaveCurrentOrderAction({ order: rs.data.order });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OrderActionTypes.UpdateOrder,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  updateOrderStatus$ = this.actions$.pipe(
    ofType<UpdateOrderStatusAction>(OrderActionTypes.UpdateOrderStatus),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: OrderActionTypes.UpdateOrderStatus,
        })
      );
      return this.orderSvc.updateOrderStatus(payload.orderId, payload.status).pipe(
        map((rs) => {
          if (rs && rs.status === ResponseStatus.SUCCESS) {
            this.store.dispatch(new FetchOrderDetailsAction({ orderId: payload.orderId }));
          }
          return rs;
        })
      );
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OrderActionTypes.UpdateOrderStatus,
        })
      );
      this.toastService.showSuccess('Update order status successfully!');

      if (!rs) {
        throw new Error('');
      }
      return new UpdateOrderStatusSuccessAction();
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OrderActionTypes.UpdateOrderStatus,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  createOrder$ = this.actions$.pipe(
    ofType<CreateOrderAction>(OrderActionTypes.CreateOrder),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: OrderActionTypes.CreateOrder,
        })
      );

      return this.orderSvc.createOrder(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OrderActionTypes.CreateOrder,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }

      this.store.dispatch(new FetchOrderListAction());
      return new CreateOrderSuccessAction({ order: rs.data.order });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  constructor(
    private actions$: Actions,
    private orderSvc: OrderService,
    private store: Store<AppState>,
    private toastService: ToastService
  ) { }
}
