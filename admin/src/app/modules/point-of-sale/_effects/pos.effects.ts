import { Injectable } from '@angular/core';
import {
	map,
	switchMap,
	catchError,
} from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '@core/reducers';
import {
	PosActionTypes,
	FetchAllProductsAction,
	SaveListAction,
	AddCartItemAction,
	RemoveCartItemAction,
	CheckoutAction,
	SaveCheckoutAction,
	SaveCartAction,
	FetchCartAction,
	UpdateCartItemQuantityAction,
	FetchAllCategoriesAction,
	SaveCategoryListAction,
	FetchAllStoresAction,
	SaveAllStoresAction,
	FetchStoreTablesAction,
	SaveStoreTablesAction,
} from '../_actions/pos.actions';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import {
	AddLoadingAction,
	RemoveLoadingAction,
} from '@app/core/actions/loading.actions';
import { PosService } from '../_services';
import { FetchOrderListAction } from '../_actions/order.actions';

@Injectable()
export class PosEffects {
	@Effect()
	fetchAllProducts$ = this.actions$.pipe(
		ofType<FetchAllProductsAction>(PosActionTypes.FetchList),
		switchMap(() => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosActionTypes.FetchList })
			);

			return this.posSvc.fetchAllProduct();
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.FetchList,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveListAction({ response: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.FetchList,
				})
			);
			return caught;
		})
	);

	@Effect()
	fetchAllCategories$ = this.actions$.pipe(
		ofType<FetchAllCategoriesAction>(PosActionTypes.FetchAllCategories),
		switchMap(() => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosActionTypes.FetchAllCategories })
			);

			return this.posSvc.fetchAllCategories();
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.FetchAllCategories,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveCategoryListAction({ response: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.FetchAllCategories,
				})
			);
			return caught;
		})
	);

	@Effect()
	fetchCart$ = this.actions$.pipe(
		ofType<FetchCartAction>(PosActionTypes.FetchCart),
		switchMap(() => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosActionTypes.FetchCart })
			);

			return this.posSvc.fetchCart();
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.FetchCart,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveCartAction({ cart: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.FetchCart,
				})
			);
			return caught;
		})
	);

	@Effect()
	addCartItem$ = this.actions$.pipe(
		ofType<AddCartItemAction>(PosActionTypes.AddCartItem),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosActionTypes.AddCartItem })
			);

			return this.posSvc.addCartItem(payload.data);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.AddCartItem,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveCartAction({ cart: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.AddCartItem,
				})
			);
			return caught;
		})
	);

	@Effect()
	updateCartItemQuantity$ = this.actions$.pipe(
		ofType<UpdateCartItemQuantityAction>(PosActionTypes.UpdateCartQuantity),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosActionTypes.UpdateCartQuantity })
			);

			return this.posSvc.updateCartItem(payload.itemId, payload.quantity, payload.note);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.UpdateCartQuantity,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveCartAction({ cart: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.UpdateCartQuantity,
				})
			);
			return caught;
		})
	);

	@Effect()
	removeCartItem$ = this.actions$.pipe(
		ofType<RemoveCartItemAction>(PosActionTypes.RemoveCartItem),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosActionTypes.RemoveCartItem })
			);

			return this.posSvc.removeCartItem(payload.itemId);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.RemoveCartItem,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveCartAction({ cart: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.RemoveCartItem,
				})
			);
			return caught;
		})
	);

	@Effect()
	checkout$ = this.actions$.pipe(
		ofType<CheckoutAction>(PosActionTypes.Checkout),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosActionTypes.Checkout })
			);

			return this.posSvc.checkout(payload.data);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.Checkout,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			this.store.dispatch(new FetchOrderListAction());
			return new SaveCheckoutAction({ order: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.Checkout,
				})
			);
			return caught;
		})
	);

	@Effect()
	fetchAllStores$ = this.actions$.pipe(
		ofType<FetchAllStoresAction>(PosActionTypes.FetchAllStores),
		switchMap(() => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosActionTypes.FetchAllStores })
			);

			return this.posSvc.fetchAllStores();
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.FetchAllStores,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveAllStoresAction({ response: rs.data });
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.FetchAllStores,
				})
			);
			return caught;
		})
	);

	@Effect()
	fetchStoreTables$ = this.actions$.pipe(
		ofType<FetchStoreTablesAction>(PosActionTypes.FetchStoreTables),
		switchMap(({ payload }) => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: PosActionTypes.FetchStoreTables })
			);

			return this.posSvc.fetchTablesByStoreId(payload.storeId);
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.FetchStoreTables,
				})
			);
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveStoreTablesAction(rs.data);
		}),
		catchError((error, caught) => {
			this.toastService.showDanger('Ops! Something went wrong.');
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: PosActionTypes.FetchStoreTables,
				})
			);
			return caught;
		})
	);

	constructor(
		private actions$: Actions,
		private posSvc: PosService,
		private store: Store<AppState>,
		private toastService: ToastService
	) { }
}
