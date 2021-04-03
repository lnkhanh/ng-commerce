import { createFeatureSelector, createSelector } from '@ngrx/store';
import { wishListState } from '../_reducers/wishlist.reducers';

export const selectWishListState = createFeatureSelector<wishListState>('wishlist');

export const selectWishListCriteria = () =>
	createSelector(selectWishListState, (state) => state.pagination);

export const selectWishListList = () =>
	createSelector(selectWishListState, (state) => state.wishlist);

export const selectCheckAddedRs = () =>
	createSelector(selectWishListState, (state) => state.isAdded);

export const selectWishListPaging = () => createSelector(
	selectWishListState,
	state => state.pagination
)