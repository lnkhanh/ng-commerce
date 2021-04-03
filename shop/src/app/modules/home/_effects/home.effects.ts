import { Injectable } from '@angular/core';
import {
	map,
	switchMap,
	withLatestFrom,
	catchError,
} from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AppState } from '@shared/reducers';

import {
	AddLoadingAction,
	RemoveLoadingAction,
} from '@shared/actions/loading.actions';
import {
	FetchProductDetailsAction,
	HomeActionTypes,
	SaveProductDetailsAction,
	SaveSearchProductsAction,
	SearchProductsAction,
} from '../_actions/home.actions';
import {
	AddCartItemAction,
	CartActionTypes,
	CheckoutAction,
	RemoveCartItemAction,
	SaveCheckoutAction,
	UpdateCartItemQuantityAction
} from '../_actions/cart.actions';
import { selectProductCriteria } from '../_selectors/home.selector';
import { RequestParamModel } from '@app/shared/models/common';
import { HomeService } from '../_services/home.service';
import { FetchUserCartAction, SaveUserCartAction } from '@app/shared/actions/base.actions';

@Injectable()
export class HomeEffects {
	@Effect()
	searchProducts$ = this.actions$.pipe(
		ofType<SearchProductsAction>(HomeActionTypes.SearchProducts),
		withLatestFrom(this.store.pipe(select(selectProductCriteria()))),
		switchMap(([_, criteria]) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: HomeActionTypes.SearchProducts })
			);

			const { pagination, filter } = criteria;
			const params = new RequestParamModel();

			if (pagination) {
				params.pageIndex = pagination.pageIndex;
				params.pageSize = pagination.pageSize;
				params.keyword = pagination.keyword;
			}

			return this.ecommerceSvc.searchProducts({...params, ...filter});
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: HomeActionTypes.SearchProducts,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveSearchProductsAction(rs.data);
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: HomeActionTypes.SearchProducts,
				})
			);
			return caught;
		})
	);

	@Effect()
	fetchProductDetails$ = this.actions$.pipe(
		ofType<FetchProductDetailsAction>(
			HomeActionTypes.FetchProductDetails
		),
		switchMap(({ productId }) => {
			this.store.dispatch(
				new AddLoadingAction({
					currentAction: HomeActionTypes.FetchProductDetails
				})
			);

			return this.ecommerceSvc.fetchProductDetails(productId);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: HomeActionTypes.FetchProductDetails
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveProductDetailsAction(rs.data);
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: HomeActionTypes.FetchProductDetails
				})
			);

			return caught;
		})
	);

	@Effect()
	addCartItem$ = this.actions$.pipe(
		ofType<AddCartItemAction>(CartActionTypes.AddCartItem),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: CartActionTypes.AddCartItem })
			);

			return this.ecommerceSvc.addCartItem(payload.data);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: CartActionTypes.AddCartItem,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveUserCartAction(rs.data);
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: CartActionTypes.AddCartItem,
				})
			);
			return caught;
		})
	);

	@Effect()
	updateCartItemQuantity$ = this.actions$.pipe(
		ofType<UpdateCartItemQuantityAction>(CartActionTypes.UpdateCartQuantity),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: CartActionTypes.UpdateCartQuantity })
			);

			return this.ecommerceSvc.updateCartItem(payload.itemId, payload.quantity, payload.note);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: CartActionTypes.UpdateCartQuantity,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveUserCartAction(rs.data);
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: CartActionTypes.UpdateCartQuantity,
				})
			);
			return caught;
		})
	);

	@Effect()
	removeCartItem$ = this.actions$.pipe(
		ofType<RemoveCartItemAction>(CartActionTypes.RemoveCartItem),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: CartActionTypes.RemoveCartItem })
			);

			return this.ecommerceSvc.removeCartItem(payload.itemId);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: CartActionTypes.RemoveCartItem,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveUserCartAction(rs.data);
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: CartActionTypes.RemoveCartItem,
				})
			);
			return caught;
		})
	);

	@Effect()
	checkout$ = this.actions$.pipe(
		ofType<CheckoutAction>(CartActionTypes.Checkout),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: CartActionTypes.Checkout })
			);

			return this.ecommerceSvc.checkout(payload.data);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: CartActionTypes.Checkout,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}
			this.store.dispatch(new FetchUserCartAction());
			return new SaveCheckoutAction(rs.data);
		}),
		catchError((error, caught) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: CartActionTypes.Checkout,
				})
			);
			return caught;
		})
	);

	constructor(
		private actions$: Actions,
		private ecommerceSvc: HomeService,
		private store: Store<AppState>
	) { }
}
