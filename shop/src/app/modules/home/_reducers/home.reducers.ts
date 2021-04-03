import produce from 'immer';
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ProductType } from '../_models/product.model';
import { HomeActions, HomeActionTypes } from '../_actions/home.actions';

interface ECommerceType { }

export interface HomeState extends EntityState<ECommerceType> {
	products: ProductType[];
	productDetails: ProductType;
	pagination: {
		pageIndex: number;
		pageSize: number;
		keyword: string;
		totalPages: number;
		totalItems: number;
	};
	filter?: {
		catSlug: string
	}
}

export const adapter: EntityAdapter<ECommerceType> = createEntityAdapter<
	ECommerceType
>();

export const initialHomeState: HomeState = produce(
	adapter.getInitialState({
		products: [],
		productDetails: null,
		pagination: {
			pageIndex: 1,
			pageSize: 12,
			keyword: '',
			totalPages: 0,
			totalItems: 0,
		},
	}),
	(draft) => draft
);

export function homeReducer(
	state = initialHomeState,
	action: HomeActions
): HomeState {
	return produce(state, (draft) => {
		switch (action.type) {
			case HomeActionTypes.SaveSearchProductsCriteria: {
				const { pageSize, pageIndex, keyword } = action.criteria;

				draft.pagination.pageIndex = pageIndex;
				draft.pagination.pageSize = pageSize;

				if (keyword !== undefined) {
					draft.pagination.keyword = keyword;
				}

				break;
			}
			case HomeActionTypes.SaveProductFilter: {
				const { catSlug } = action.payload;

				if (catSlug) {
					draft.filter = {
						catSlug
					};
				}

				break;
			}
			case HomeActionTypes.SaveProducts: {
				const { records, totalItems, pages } = { ...action.response };
				draft.products = records;
				draft.pagination.totalItems = totalItems;
				draft.pagination.totalPages = pages;

				break;
			}
			case HomeActionTypes.SaveProductDetails: {
				draft.productDetails = action.product;
				break;
			}
			default: return state;
		}
		return draft;
	});
}

export const getHomeState = createFeatureSelector<HomeState>('home');
