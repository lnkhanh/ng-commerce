import produce from 'immer';
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CartType, CheckoutResult } from '../_models/cart.model';
import { CartActions, CartActionTypes } from '../_actions/cart.actions';

export interface cartState extends EntityState<CartType> {
	checkoutData?: CheckoutResult;
}

export const adapter: EntityAdapter<CartType> = createEntityAdapter<
	CartType
>();

export const initialCartState: cartState = produce(
	adapter.getInitialState({
	}),
	(draft) => draft
);

export function cartReducer(
	state = initialCartState,
	action: CartActions
): cartState {
	return produce(state, (draft) => {
		switch (action.type) {
			case CartActionTypes.Checkout: {
				draft.checkoutData = null;
				break;
			}
			case CartActionTypes.SaveCheckoutResult: {
				draft.checkoutData = action.payload;
				break;
			}
			default: return state;
		}
		return draft;
	});
}

export const getCartState = createFeatureSelector<cartState>('cart');
