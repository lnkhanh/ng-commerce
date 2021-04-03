import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PosActions, PosActionTypes } from '../_actions/pos.actions';
import { ProductType } from '@app/modules/e-commerce/_models/product.model';
import produce from 'immer';
import { CategoryType, OrderType } from '@app/modules/e-commerce';
import { CartType } from '../_models/pos.model';
import { StoreTableType, StoreType } from '@app/modules/e-commerce/_models/store.model';

export interface PosState extends EntityState<ProductType> {
	allProducts: ProductType[];
	allCategories: CategoryType[];
	allStores: StoreType[];
	storeTables: StoreTableType[];
	newOrder?: OrderType;
	currentCart?: CartType;
	currentStore?: StoreType;
	currentTable?: StoreTableType;
}

export const adapter: EntityAdapter<ProductType> = createEntityAdapter<ProductType>();

export const initialPosState: PosState = produce(
	adapter.getInitialState({
		allProducts: [],
		allCategories: [],
		allStores: [],
		storeTables: []
	}),
	draft => draft
);

export function posReducer(
	state = initialPosState,
	action: PosActions
): PosState {
	return produce(state, (draft) => {
		switch (action.type) {
			case PosActionTypes.SaveList: {
				const { response } = action.payload;
				draft.allProducts = response;
				break;
			}
			case PosActionTypes.SaveCategoryList: {
				const { response } = action.payload;
				draft.allCategories = response;
				break;
			}
			case PosActionTypes.SaveStoreList: {
				const { response } = action.payload;
				draft.allStores = response;
				break;
			}
			case PosActionTypes.SaveStoreTables: {
				draft.storeTables = action.payload;
				break;
			}
			case PosActionTypes.SaveCurrentStore: {
				draft.currentStore = action.payload;
				break;
			}
			case PosActionTypes.SaveCurrentTable: {
				draft.currentTable = action.payload;
				break;
			}
			case PosActionTypes.SaveCart: {
				const { cart } = action.payload;
				draft.currentCart = cart;
				break;
			}
			case PosActionTypes.Checkout: {
				draft.newOrder = null;
				break;
			}
			case PosActionTypes.SaveCheckoutResult: {
				const { order } = action.payload;
				if (order) {
					draft.currentCart = null;
					draft.newOrder = order;
				}
				break;
			}
			default:
				return state;
		}
	});
}

export const getPosState = createFeatureSelector<PosState>('pos');

export const {
	selectAll,
} = adapter.getSelectors();
