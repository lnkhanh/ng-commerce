import { Action } from '@ngrx/store';
import { AddCartItemData, CheckoutData, CheckoutResult } from '../_models/cart.model';

export enum CartActionTypes {
	AddCartItem = '[CART] Add Cart Item',
	UpdateCartQuantity = '[CART] Update Cart Item Quantity',
	RemoveCartItem = '[CART] Remove Cart Item',

	Checkout = '[CART] Checkout',
	SaveCheckoutResult = '[CART] Save Checkout Result',
}

// Cart
export class AddCartItemAction implements Action {
	readonly type = CartActionTypes.AddCartItem;

	constructor(public payload: { data: AddCartItemData }) { }
}

export class UpdateCartItemQuantityAction implements Action {
	readonly type = CartActionTypes.UpdateCartQuantity;

	constructor(public payload: { itemId: string, quantity: number, note: string }) { }
}

export class RemoveCartItemAction implements Action {
	readonly type = CartActionTypes.RemoveCartItem;

	constructor(public payload: { itemId: string }) { }
}

export class CheckoutAction implements Action {
	readonly type = CartActionTypes.Checkout;

	constructor(public payload: { data: CheckoutData }) { }
}

export class SaveCheckoutAction implements Action {
	readonly type = CartActionTypes.SaveCheckoutResult;

	constructor(public payload: CheckoutResult) { }
}

export type CartActions =
	| AddCartItemAction
	| UpdateCartItemQuantityAction
	| RemoveCartItemAction
	| CheckoutAction
	| SaveCheckoutAction;
