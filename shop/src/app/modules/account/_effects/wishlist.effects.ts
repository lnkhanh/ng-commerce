import { Injectable } from '@angular/core';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AppState } from '@shared/reducers';
import { AddLoadingAction, RemoveLoadingAction } from '@shared/actions/loading.actions';
import { RequestParamModel, ResponseStatus } from '@app/shared/models/common';
import { WishListService } from '../_services/wishlist.service';
import {
	FetchWishListAction,
	WishListActionTypes,
	SaveWishListAction,
	AddToWishList,
	AddToWishListSuccess,
	RemoveWishListAction,
	RemoveWishListSuccessAction,
	CheckAddedAction,
	SaveCheckAddedAction
} from '../_actions/wishlist.actions';
import { selectWishListCriteria } from '../_selectors/wishlist.selector';

@Injectable()
export class WishListEffects {

	constructor(private actions$: Actions, private wishListSvc: WishListService, private store: Store<AppState>) { }

	@Effect()
	fetchWishList$ = this
		.actions$
		.pipe(ofType<FetchWishListAction>(WishListActionTypes.FetchWishList), withLatestFrom(this.store.pipe(select(selectWishListCriteria()))), switchMap(([_, pagination]) => {
			this
				.store
				.dispatch(new AddLoadingAction({ currentAction: WishListActionTypes.FetchWishList }));

			const params = new RequestParamModel();
			params.pageIndex = pagination.pageIndex;
			params.pageSize = pagination.pageSize;

			return this
				.wishListSvc
				.fetchWishList(params);
		}), map((rs) => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: WishListActionTypes.FetchWishList }));
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveWishListAction(rs.data);
		}), catchError((error, caught) => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: WishListActionTypes.FetchWishList }));
			return caught;
		}));

	@Effect()
	addWishList$ = this
		.actions$
		.pipe(ofType<AddToWishList>(WishListActionTypes.AddWishList), switchMap(({ productId }) => {
			return this
				.wishListSvc
				.addWishList(productId);
		}), map(rs => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: WishListActionTypes.AddWishList }));

			if (!rs || rs.status === ResponseStatus.FAILED) {
				throw new Error('');
			}
			return new AddToWishListSuccess();
		}), catchError((error, caught) => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: WishListActionTypes.AddWishList }));
			return caught;
		}));

	@Effect()
	removeWishList$ = this
		.actions$
		.pipe(ofType<RemoveWishListAction>(WishListActionTypes.RemoveWishList), switchMap(({ id }) => {
			return this
				.wishListSvc
				.removeWishList(id);
		}), map(rs => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: WishListActionTypes.RemoveWishList }));

			if (!rs || rs.status === ResponseStatus.FAILED) {
				throw new Error('');
			}

			this
				.store
				.dispatch(new FetchWishListAction());
			return new RemoveWishListSuccessAction();
		}), catchError((error, caught) => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: WishListActionTypes.RemoveWishList }));
			return caught;
		}));

	@Effect()
	checkAdded$ = this
		.actions$
		.pipe(ofType<CheckAddedAction>(WishListActionTypes.CheckAdded), switchMap(({ productId }) => {
			return this
				.wishListSvc
				.checkAdded(productId);
		}), map(rs => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: WishListActionTypes.CheckAdded }));

			if (!rs || rs.status === ResponseStatus.FAILED) {
				throw new Error('');
			}

			return new SaveCheckAddedAction(rs.data);
		}), catchError((error, caught) => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: WishListActionTypes.CheckAdded }));
			return caught;
		}));
}
