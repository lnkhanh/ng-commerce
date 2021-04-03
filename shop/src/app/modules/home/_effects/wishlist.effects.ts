import { Injectable } from '@angular/core';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '@shared/reducers';
import { RemoveLoadingAction } from '@shared/actions/loading.actions';
import { ResponseStatus } from '@app/shared/models/common';
import { HomeService } from '../_services/home.service';
import {
	FetchWishListAction,
	WishListActionTypes,
	AddToWishList,
	AddToWishListSuccess,
	RemoveWishListAction,
	RemoveWishListSuccessAction,
	CheckAddedAction,
	SaveCheckAddedAction
} from '../_actions/wishlist.actions';

@Injectable()
export class WishListEffects {

	constructor(private actions$: Actions, private ecommerceSvc: HomeService, private store: Store<AppState>) { }

	@Effect()
	addWishList$ = this
		.actions$
		.pipe(ofType<AddToWishList>(WishListActionTypes.AddWishList), switchMap(({ productId }) => {
			return this
				.ecommerceSvc
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
				.ecommerceSvc
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
				.ecommerceSvc
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
