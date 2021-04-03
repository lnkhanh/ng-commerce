import { RequestParamModel, ResponseData } from '@app/shared/models/common';
import { Action } from '@ngrx/store';
// import { AddCartItemData, CartType, CheckoutData, CheckoutResult } from '../_models/cart.model';
import { ProductType } from '../_models/product.model';

export enum HomeActionTypes {
	// AddCartItem = '[CART] Add Cart Item',
	// UpdateCartQuantity = '[CART] Update Cart Item Quantity',
	// RemoveCartItem = '[CART] Remove Cart Item',

	// Checkout = '[CART] Checkout',
	// SaveCheckoutResult = '[CART] Save Checkout Result',
	// End cart

	SaveSearchProductsCriteria = '[PRODUCTS] Save Search Products Criteria',
	SaveProductFilter = '[PRODUCT] Save Product Filter',

	SearchProducts = '[PRODUCTS] Search Products',
	SaveProducts = '[PRODUCTS] Save Products',

	FetchProductDetails = '[PRODUCT] Fetch Product Details',
	SaveProductDetails = '[PRODUCT] Save Product Details'
}

// Cart
// export class AddCartItemAction implements Action {
// 	readonly type = HomeActionTypes.AddCartItem;

// 	constructor(public payload: { data: AddCartItemData }) { }
// }

// export class UpdateCartItemQuantityAction implements Action {
// 	readonly type = HomeActionTypes.UpdateCartQuantity;

// 	constructor(public payload: { itemId: string, quantity: number, note: string }) { }
// }

// export class RemoveCartItemAction implements Action {
// 	readonly type = HomeActionTypes.RemoveCartItem;

// 	constructor(public payload: { itemId: string }) { }
// }

// export class CheckoutAction implements Action {
// 	readonly type = HomeActionTypes.Checkout;

// 	constructor(public payload: { data: CheckoutData }) { }
// }

// export class SaveCheckoutAction implements Action {
// 	readonly type = HomeActionTypes.SaveCheckoutResult;

// 	constructor(public payload: CheckoutResult) { }
// }
// End cart

export class SaveSearchProductsCriteriaAction implements Action {
	readonly type = HomeActionTypes.SaveSearchProductsCriteria;

	constructor(public criteria: RequestParamModel) { }
}

export class SaveProductFilterAction implements Action {
	readonly type = HomeActionTypes.SaveProductFilter;

	constructor(public payload: { catSlug?: string }) {}
}

export class SearchProductsAction implements Action {
	readonly type = HomeActionTypes.SearchProducts;

	constructor() { }
}

export class SaveSearchProductsAction implements Action {
	readonly type = HomeActionTypes.SaveProducts;

	constructor(public response: ResponseData) { }
}

export class FetchProductDetailsAction implements Action {
	readonly type = HomeActionTypes.FetchProductDetails;

	constructor(public productId: string) { }
}

export class SaveProductDetailsAction implements Action {
	readonly type = HomeActionTypes.SaveProductDetails;

	constructor(public product: ProductType) { }
}

export type HomeActions =
	// | AddCartItemAction
	// | UpdateCartItemQuantityAction
	// | RemoveCartItemAction
	// | CheckoutAction
	// | SaveCheckoutAction
	| SaveSearchProductsCriteriaAction
	| SaveProductFilterAction
	| SearchProductsAction
	| SaveSearchProductsAction
	| FetchProductDetailsAction
	| SaveProductDetailsAction;
