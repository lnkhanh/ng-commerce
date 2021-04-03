import { Injectable } from '@angular/core';
import {
	map,
	switchMap,
	catchError,
	withLatestFrom,
} from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { AppState } from '@core/reducers';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import {
	AddLoadingAction,
	RemoveLoadingAction,
} from '@app/core/actions/loading.actions';
import { PosOrderService } from '../_services';
import {
	ChangeOrderStatusAction, ChangeOrderStatusSuccessAction,
	FetchOrderDetailsAction, FetchOrderListAction, PosOrderActionTypes,
	RemoveOrderAction, RemoveOrderItemAction, RemoveOrderSuccessAction,
	SaveOrderDetailsAction, SaveOrderListAction,
	UpdateOrderItemQuantityAction,
	UpdateOrderItemQuantitySuccessAction
} from '../_actions/order.actions';
import { RequestParamModel } from '@app/core/models/common';
import { selectPosOrderPagination } from '../_selectors/order.selectors';
import { of } from 'rxjs';
@Injectable()
export class PosOrderEffects {
	@Effect()
	fetchAllProducts$ = this.actions$.pipe(
		ofType<FetchOrderListAction>(PosOrderActionTypes.FetchOrderList),
		withLatestFrom(this.store.pipe(select(selectPosOrderPagination()))),
		switchMap(([_, pagination]) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosOrderActionTypes.FetchOrderList })
			);

			const params = new RequestParamModel();
			params.pageIndex = pagination.pageIndex;
			params.pageSize = pagination.pageSize;
			params.keyword = pagination.keyword;

			return this.orderSvc.fetchOrders(params);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.FetchOrderList,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveOrderListAction({ response: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.FetchOrderList,
				})
			);
			return caught;
		})
	);


	@Effect()
	fetchOrderDetails$ = this.actions$.pipe(
		ofType<FetchOrderDetailsAction>(PosOrderActionTypes.FetchOrderDetails),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosOrderActionTypes.FetchOrderDetails })
			);

			return this.orderSvc.fetchOrderDetails(payload.orderId);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.FetchOrderDetails,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveOrderDetailsAction({ order: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Order not found.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.FetchOrderDetails,
				})
			);
			return caught;
		})
	);

	@Effect()
	changeOrderStatus$ = this.actions$.pipe(
		ofType<ChangeOrderStatusAction>(PosOrderActionTypes.ChangeOrderStatus),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosOrderActionTypes.ChangeOrderStatus })
			);

			return this.orderSvc.changeOrderStatus(payload.orderId, payload.status).pipe(
				map((rs) => {
					if (rs && rs.status) {
						if (payload.reloadDetail) {
							this.store.dispatch(new FetchOrderDetailsAction({ orderId: payload.orderId }));
						}

						this.store.dispatch(new FetchOrderListAction());
					}

					return rs;
				})
			);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.ChangeOrderStatus,
				})
			);
			if (!rs || !rs.status) {
				throw new Error('');
			}

			return new ChangeOrderStatusSuccessAction();
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.ChangeOrderStatus,
				})
			);
			return caught;
		})
	);

	@Effect()
	removeOrder$ = this.actions$.pipe(
		ofType<RemoveOrderAction>(PosOrderActionTypes.RemoveOrder),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosOrderActionTypes.RemoveOrder })
			);

			return this.orderSvc.removeOrder(payload.orderId);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.RemoveOrder,
				})
			);
			if (!rs || !rs.status) {
				throw new Error('');
			}

			this.store.dispatch(new FetchOrderListAction());

			return new RemoveOrderSuccessAction();
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.RemoveOrder,
				})
			);
			return caught;
		})
	);

	@Effect()
	updateOrderItemQuantity$ = this.actions$.pipe(
		ofType<UpdateOrderItemQuantityAction>(PosOrderActionTypes.UpdateOrderItemQuantity),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosOrderActionTypes.UpdateOrderItemQuantity })
			);

			return this.orderSvc.updateOrderItem(payload.orderId, payload.itemId, payload.quantity, payload.note);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.UpdateOrderItemQuantity,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			// All items removed && the order will removed
			if (!rs.data.products || !rs.data.products.length) {
				this.store.dispatch(new FetchOrderListAction());
				return new SaveOrderDetailsAction({ order: null });
			}

			return new FetchOrderDetailsAction({ orderId: rs.data.id });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.UpdateOrderItemQuantity,
				})
			);
			return caught;
		})
	);

	@Effect()
	removeOrderItem$ = this.actions$.pipe(
		ofType<RemoveOrderItemAction>(PosOrderActionTypes.RemoveOrderItem),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosOrderActionTypes.RemoveOrderItem })
			);

			return this.orderSvc.removeOrderItem(payload.orderId, payload.itemId).pipe(
				map((rs) => {
					if (rs && rs.status) {
						this.store.dispatch(new FetchOrderDetailsAction({ orderId: payload.orderId }));
					}

					return rs;
				})
			);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.RemoveOrderItem,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveOrderDetailsAction({ order: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosOrderActionTypes.RemoveOrderItem,
				})
			);
			return caught;
		})
	);

	constructor(
		private actions$: Actions,
		private orderSvc: PosOrderService,
		private store: Store<AppState>,
		private toastService: ToastService
	) { }
}
