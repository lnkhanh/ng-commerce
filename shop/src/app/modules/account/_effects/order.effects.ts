import { Injectable } from '@angular/core';
import {
	map,
	switchMap,
	withLatestFrom,
	catchError,
} from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AppState } from '@shared/reducers';

import {
	AddLoadingAction,
	RemoveLoadingAction,
} from '@shared/actions/loading.actions';
import { RequestParamModel } from '@app/shared/models/common';
import { OrderService } from '../_services/order.service';
import { FetchOrderDetailsAction, FetchOrderHistoryAction, OrderActionTypes, SaveOrderDetailsAction, SaveOrderHistoryAction } from '../_actions/order.actions';
import { selectOrderCriteria } from '../_selectors/order.selector';

@Injectable()
export class OrderEffects {
	@Effect()
	searchOrders$ = this.actions$.pipe(
		ofType<FetchOrderHistoryAction>(OrderActionTypes.FetchOrders),
		withLatestFrom(this.store.pipe(select(selectOrderCriteria()))),
		switchMap(([_, pagination]) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: OrderActionTypes.FetchOrders })
			);

			const params = new RequestParamModel();
			params.pageIndex = pagination.pageIndex;
			params.pageSize = pagination.pageSize;

			return this.orderSvc.fetchOrders(params);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: OrderActionTypes.FetchOrders,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveOrderHistoryAction(rs.data);
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: OrderActionTypes.FetchOrders,
				})
			);
			return caught;
		})
	);

	@Effect()
	fetchOrderDetails$ = this.actions$.pipe(
		ofType<FetchOrderDetailsAction>(
			OrderActionTypes.FetchOrderDetails
		),
		switchMap(({ orderCode }) => {
			this.store.dispatch(
				new AddLoadingAction({
					currentAction: OrderActionTypes.FetchOrderDetails
				})
			);

			return this.orderSvc.fetchOrderDetails(orderCode);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: OrderActionTypes.FetchOrderDetails
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveOrderDetailsAction(rs.data);
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: OrderActionTypes.FetchOrderDetails
				})
			);

			return caught;
		})
	);

	constructor(
		private actions$: Actions,
		private orderSvc: OrderService,
		private store: Store<AppState>
	) { }
}
