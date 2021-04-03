import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HomeState } from '../_reducers/home.reducers';

export const selectHomeState = createFeatureSelector<HomeState>('home');

export const selectProductCriteria = () =>
	createSelector(selectHomeState, (state) => ({
		pagination: state.pagination,
		filter: state.filter
	}));

export const selectProductList = () =>
	createSelector(selectHomeState, (state) => state.products);

export const selectProductDetails = () =>
	createSelector(selectHomeState, (state) => state.productDetails);

export const selectProductPaging = () => createSelector(
	selectHomeState,
	state => state.pagination
);
