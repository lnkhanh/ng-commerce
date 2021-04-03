import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BaseState } from '../reducers/base.reducers';
export const selectBaseState = createFeatureSelector<BaseState>('base');

export const selectCategoryList = () =>
	createSelector(selectBaseState, (state) => state.categories);

export const selectCart = () =>
	createSelector(selectBaseState, (state) => state.cart);

export const selectCartState = () =>
	createSelector(selectBaseState, (state) => state.isCartOpened);

export const selectProfileMenuState = () =>
	createSelector(selectBaseState, (state) => state.isMenuProfileOpened);