import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cartState } from '../_reducers/cart.reducers';

export const selectCartState = createFeatureSelector<cartState>('cart');

export const selectCheckoutResults = () => createSelector(selectCartState, state => state.checkoutData);