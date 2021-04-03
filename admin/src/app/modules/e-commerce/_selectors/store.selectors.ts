import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StoreState } from '../_reducers/store.reducers';

export const selectStoreState = createFeatureSelector<StoreState>('stores');

export const selectStorePagination = () =>
  createSelector(selectStoreState, (state) => state.pagination);

export const selectStoreList = () =>
  createSelector(selectStoreState, (state) => state.list);

export const selectAllStores = () =>
  createSelector(selectStoreState, (state) => state.allStores);

export const selectCurrentStore = () =>
  createSelector(selectStoreState, (state) => state.currentStore);

// Store Table
export const selectStoreTablePagination = () =>
  createSelector(selectStoreState, (state) => state.paginationStoreTable);

export const selectStoreTableList = () =>
  createSelector(selectStoreState, (state) => state.listStoreTable);

export const selectCurrentStoreTable = () =>
  createSelector(selectStoreState, (state) => state.currentStoreTable);
