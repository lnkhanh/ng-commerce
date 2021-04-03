import produce from 'immer';
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CategoryType } from '@app/modules/home/_models/category.model';
import { CartType } from '@app/modules/home/_models/cart.model';
import { BaseActions, BaseActionTypes } from '../actions/base.actions';

interface BaseType { }

export interface BaseState extends EntityState<BaseType> {
	categories: CategoryType[];
	cart?: CartType;
	isCartOpened: boolean;
	isMenuProfileOpened: boolean;
}

export const adapter: EntityAdapter<BaseType> = createEntityAdapter<
	BaseType
>();

export const initialBaseState: BaseState = produce(
	adapter.getInitialState({
		categories: [],
		isCartOpened: false,
		isMenuProfileOpened: false
	}),
	(draft) => draft
);

export function baseReducer(
	state = initialBaseState,
	action: BaseActions
): BaseState {
	return produce(state, (draft) => {
		switch (action.type) {
			case BaseActionTypes.SaveCategories: {
				draft.categories = action.categories;
				break;
			}
			case BaseActionTypes.SaveUserCart: {
				draft.cart = action.cart;
				break;
			}
			case BaseActionTypes.ToggleCart: {
				if (draft.isMenuProfileOpened) {
					draft.isMenuProfileOpened = false;
				}

				draft.isCartOpened = !draft.isCartOpened;
				break;
			}
			case BaseActionTypes.ToggleProfileMenu: {
				if (draft.isCartOpened) {
					draft.isCartOpened = false;
				}
				
				draft.isMenuProfileOpened = !draft.isMenuProfileOpened;
				break;
			}
			default: return state;
		}
		return draft;
	});
}

export const getBaseState = createFeatureSelector<BaseState>('base');
