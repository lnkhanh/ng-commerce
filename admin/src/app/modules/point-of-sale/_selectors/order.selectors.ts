import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PosOrderState } from '../_reducers/order.reducers';

export const selectPosOrderState = createFeatureSelector<PosOrderState>('posOrder');

export const selectPosOrderPagination = () =>
	createSelector(selectPosOrderState, (state) => state.pagination);

export const selectPosOrderList = () =>
	createSelector(selectPosOrderState, (state) => state.list);

export const selectCurrentOrder = () => createSelector(selectPosOrderState, (state) => state.currentOrder);
