import { RequestParamModel, ResponseData } from '@app/shared/models/common';
import { Action } from '@ngrx/store';

export enum WishListActionTypes {
	FetchWishList = '[WISHLIST] Fetch WishList',
	SaveWishList = '[WISHLIST] Save WishList',
	SaveWishListCriteria = '[WISHLIST] Save WishList Criteria',

	AddWishList = '[WISHLIST] Add To WishList',
	AddWishListSuccess = '[WISHLIST] Add To WishList Success',

	RemoveWishList = '[WISHLIST] Remove WishList',
	RemoveWishListSuccess = '[WISHLIST] Remove WishList Success',

	CheckAdded = '[WISHLIST] Check Product Added',
	SaveAdded = '[WISHLIST] Save Product Added'
}

export class AddToWishList implements Action {
	readonly type = WishListActionTypes.AddWishList;

	constructor(public productId: string) { }
}

export class AddToWishListSuccess implements Action {
	readonly type = WishListActionTypes.AddWishListSuccess;

	constructor() { }
}

export class RemoveWishListAction implements Action {
	readonly type = WishListActionTypes.RemoveWishList;

	constructor(public id: string) { }
}

export class RemoveWishListSuccessAction implements Action {
	readonly type = WishListActionTypes.RemoveWishListSuccess;

	constructor() { }
}

export class FetchWishListAction implements Action {
	readonly type = WishListActionTypes.FetchWishList;

	constructor() { }
}

export class SaveWishListAction implements Action {
	readonly type = WishListActionTypes.SaveWishList;

	constructor(public response: ResponseData) { }
}

export class SaveWishListCriteriaAction implements Action {
	readonly type = WishListActionTypes.SaveWishListCriteria;

	constructor(public criteria: RequestParamModel) { }
}

export class CheckAddedAction implements Action {
	readonly type = WishListActionTypes.CheckAdded;

	constructor(public productId: string) { }
}

export class SaveCheckAddedAction implements Action {
	readonly type = WishListActionTypes.SaveAdded;

	constructor(public isAdded: boolean) { }
}

export type WishListActions =
	AddToWishList |
	AddToWishListSuccess |
	RemoveWishListAction |
	RemoveWishListSuccessAction |
	FetchWishListAction |
	SaveWishListAction |
	SaveWishListCriteriaAction |
	CheckAddedAction |
	SaveCheckAddedAction;
