import { Action } from '@ngrx/store';
import { CategoryType, OrderType, ProductType } from '@app/modules/e-commerce';
import { AddCartItemData, CartType, CheckoutData } from '../_models/pos.model';
import { StoreTableType, StoreType } from '@app/modules/e-commerce/_models/store.model';

export enum PosActionTypes {
	FetchList = '[POS] Fetch Product List',
	SaveList = '[POS] Save Product List',

	FetchAllCategories = '[POS CATEGORY] Fetch All Categories',
	SaveCategoryList = '[POS CATEGORY] Save All Categories',

	FetchAllStores = '[POS STORE] Fetch All Stores',
	SaveStoreList = '[POS STORE] Save All Stores',

	FetchCurrentStore = '[POS STORE] Fetch Current Store',
	SaveCurrentStore = '[POS STORE] Save Current Store',

	FetchStoreTables = '[POS STORE TABLES] Fetch Store Tables',
	SaveStoreTables = '[POS STORE TABLES] Save Store Tables',

	FetchCurrentTable = '[POS STORE TABLES] Fetch Current Table',
	SaveCurrentTable = '[POS STORE TABLES] Save Current Table',

	AddCartItem = '[POS] Add Cart Item',
	UpdateCartQuantity = '[POS] Update Cart Item Quantity',
	RemoveCartItem = '[POS] Remove Cart Item',
	FetchCart = '[POS] Fetch Cart',
	SaveCart = '[POS] Save Cart',

	Checkout = '[POS] Checkout',
	SaveCheckoutResult = '[POS] Save Checkout Result'
}

export class FetchAllProductsAction implements Action {
	readonly type = PosActionTypes.FetchList;

	constructor() { }
}

export class SaveListAction implements Action {
	readonly type = PosActionTypes.SaveList;

	constructor(public payload: { response: ProductType[] }) { }
}


export class FetchAllCategoriesAction implements Action {
	readonly type = PosActionTypes.FetchAllCategories;

	constructor() { }
}

export class SaveCategoryListAction implements Action {
	readonly type = PosActionTypes.SaveCategoryList;

	constructor(public payload: { response: CategoryType[] }) { }
}

export class FetchCartAction implements Action {
	readonly type = PosActionTypes.FetchCart;

	constructor() { }
}

export class SaveCartAction implements Action {
	readonly type = PosActionTypes.SaveCart;

	constructor(public payload: { cart: CartType }) { }
}

export class AddCartItemAction implements Action {
	readonly type = PosActionTypes.AddCartItem;

	constructor(public payload: { data: AddCartItemData }) { }
}

export class UpdateCartItemQuantityAction implements Action {
	readonly type = PosActionTypes.UpdateCartQuantity;

	constructor(public payload: { itemId: string, quantity: number, note: string }) { }
}

export class RemoveCartItemAction implements Action {
	readonly type = PosActionTypes.RemoveCartItem;

	constructor(public payload: { itemId: string }) { }
}

export class CheckoutAction implements Action {
	readonly type = PosActionTypes.Checkout;

	constructor(public payload: { data: CheckoutData }) { }
}

export class SaveCheckoutAction implements Action {
	readonly type = PosActionTypes.SaveCheckoutResult;

	constructor(public payload: { order: OrderType }) { }
}

export class FetchAllStoresAction implements Action {
	readonly type = PosActionTypes.FetchAllStores;

	constructor() { }
}

export class SaveAllStoresAction implements Action {
	readonly type = PosActionTypes.SaveStoreList;

	constructor(public payload: { response: StoreType[] }) { }
}

export class FetchCurrentStoreAction implements Action {
	readonly type = PosActionTypes.FetchCurrentStore;

	constructor() { }
}

export class SaveCurrentStoreAction implements Action {
	readonly type = PosActionTypes.SaveCurrentStore;

	constructor(public payload: StoreType) { }
}

export class FetchStoreTablesAction implements Action {
	readonly type = PosActionTypes.FetchStoreTables;

	constructor(public payload: { storeId: string }) { }
}

export class SaveStoreTablesAction implements Action {
	readonly type = PosActionTypes.SaveStoreTables;

	constructor(public payload: StoreTableType[]) { }
}

export class FetchCurrentTableAction implements Action {
	readonly type = PosActionTypes.FetchCurrentTable;

	constructor() { }
}

export class SaveCurrentTableAction implements Action {
	readonly type = PosActionTypes.SaveCurrentTable;

	constructor(public payload: StoreTableType) { }
}

export type PosActions =
	| FetchAllProductsAction
	| SaveListAction
	| FetchAllCategoriesAction
	| SaveCategoryListAction
	| FetchCartAction
	| SaveCartAction
	| AddCartItemAction
	| RemoveCartItemAction
	| UpdateCartItemQuantityAction
	| CheckoutAction
	| SaveCheckoutAction
	| FetchAllStoresAction
	| SaveAllStoresAction
	| FetchCurrentStoreAction
	| SaveCurrentStoreAction
	| FetchStoreTablesAction
	| SaveStoreTablesAction
	| FetchCurrentTableAction
	| SaveCurrentTableAction;
