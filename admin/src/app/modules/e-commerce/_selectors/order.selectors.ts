import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from '../_reducers/order.reducers';

export const selectOrderState = createFeatureSelector<OrderState>('orders');

export const selectOrderPagination = () =>
  createSelector(selectOrderState, (state) => state.pagination);

export const selectOrderList = () =>
  createSelector(selectOrderState, (state) => state.list);

export const selectCurrentOrder = () =>
  createSelector(selectOrderState, (state) => state.currentOrder);
