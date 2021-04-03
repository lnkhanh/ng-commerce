import produce from 'immer';
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { WishListActions, WishListActionTypes } from '../_actions/wishlist.actions';
import { WishListType } from '../_models/wishlist.model';

export interface wishListState extends EntityState<WishListType> {
	wishlist: WishListType[];
	isAdded?: boolean;
	pagination: {
		pageIndex: number;
		pageSize: number;
		totalPages: number;
		totalItems: number;
	};
}

export const adapter: EntityAdapter<WishListType> = createEntityAdapter<
WishListType
>();

export const initialWishListState: wishListState = produce(
	adapter.getInitialState({
		wishlist: [],
		pagination: {
			pageIndex: 1,
			pageSize: 10,
			totalPages: 0,
			totalItems: 0,
		},
	}),
	(draft) => draft
);

export function wishListReducer(
	state = initialWishListState,
	action: WishListActions
): wishListState {
	return produce(state, (draft) => {
		switch (action.type) {
			case WishListActionTypes.SaveWishListCriteria: {
				const { pageSize, pageIndex } = action.criteria;

				draft.pagination.pageIndex = pageIndex;
				draft.pagination.pageSize = pageSize;

				break;
			}
			case WishListActionTypes.SaveWishList: {
				const { records, totalItems, pages } = {...action.response};
				draft.wishlist = records;
				draft.pagination.totalItems = totalItems;
				draft.pagination.totalPages = pages;

				break;
			}
			case WishListActionTypes.CheckAdded: {
				draft.isAdded = null;
				break;
			}
			case WishListActionTypes.SaveAdded: {
				draft.isAdded = action.isAdded;
				break;
			}
			default: return state;
		}
		return draft;
	});
}

export const getWishListState = createFeatureSelector<wishListState>('wishlist');
