import { Action } from '@ngrx/store';
import { CategoryType } from '@app/modules/home/_models/category.model';
import { CartType } from '@app/modules/home/_models/cart.model';

export enum BaseActionTypes {
	FetchAllCategories = '[BASE CATEGORY] Fetch All Categories',
	SaveCategories = '[BASE CATEGORY] Save Categories',

	// Cart
	FetchUserCart = '[CART] Fetch User Cart',
	SaveUserCart = '[CART] Save User Cart',

	// Menu
	ToggleCart = '[HEADER] Toggle Cart',
	ToggleProfileMenu = '[HEADER] Toggle Profile Menu'
}

export class FetchAllCategoriesAction implements Action {
	readonly type = BaseActionTypes.FetchAllCategories;

	constructor() { }
}

export class SaveCategoriesAction implements Action {
	readonly type = BaseActionTypes.SaveCategories;

	constructor(public categories: CategoryType[]) { }
}

// Cart
export class FetchUserCartAction implements Action {
	readonly type = BaseActionTypes.FetchUserCart;

	constructor() { }
}

export class SaveUserCartAction implements Action {
	readonly type = BaseActionTypes.SaveUserCart;

	constructor(public cart: CartType) { }
}

// Menu
export class ToggleCartAction implements Action {
	readonly type = BaseActionTypes.ToggleCart;

	constructor() { }
}

export class ToggleMenuProfileAction implements Action {
	readonly type = BaseActionTypes.ToggleProfileMenu;

	constructor() { }
}

export type BaseActions = FetchAllCategoriesAction | SaveCategoriesAction | FetchUserCartAction | SaveUserCartAction | ToggleCartAction | ToggleMenuProfileAction;