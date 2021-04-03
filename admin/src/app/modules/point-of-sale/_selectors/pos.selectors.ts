import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PosState } from '../_reducers/pos.reducers';

export const selectPosState = createFeatureSelector<PosState>('pos');

export const selectAllProducts = () =>
	createSelector(selectPosState, (state) => state.allProducts);

export const selectAllCategories = () =>
	createSelector(selectPosState, (state) => state.allCategories);

export const selectAllStores = () =>
	createSelector(selectPosState, (state) => state.allStores);

export const selectStoreTables = () =>
	createSelector(selectPosState, (state) => state.storeTables);

export const selectCurrentStore = () =>
	createSelector(selectPosState, (state) => state.currentStore);

export const selectCurrentTable = () =>
	createSelector(selectPosState, (state) => state.currentTable);

export const selectCurrentCart = () => createSelector(selectPosState, (state) => state.currentCart);
