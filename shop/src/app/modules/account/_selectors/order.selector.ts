import { createFeatureSelector, createSelector } from '@ngrx/store';
import { orderState } from '../_reducers/order.reducers';

export const selectOrderState = createFeatureSelector<orderState>('order');

export const selectOrderCriteria = () =>
	createSelector(selectOrderState, (state) => state.pagination);

export const selectOrderList = () =>
	createSelector(selectOrderState, (state) => state.orders);

export const selectOrderDetails = () =>
	createSelector(selectOrderState, (state) => state.orderDetails);

export const selectOrderPaging = () => createSelector(
	selectOrderState,
	state => state.pagination
)