import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from '../_reducers/customer.reducers';

export const selectCustomerState = createFeatureSelector<CustomerState>('customers');

export const selectCustomerPagination = () =>
  createSelector(selectCustomerState, (state) => state.pagination);

export const selectCustomerList = () =>
  createSelector(selectCustomerState, (state) => state.list);

export const selectCurrentCustomer = () =>
  createSelector(selectCustomerState, (state) => state.currentCustomer);
