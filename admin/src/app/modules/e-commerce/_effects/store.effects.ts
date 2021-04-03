import { Injectable } from '@angular/core';
import {
  mergeMap,
  map,
  switchMap,
  withLatestFrom,
  catchError,
} from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AppState } from '@core/reducers';
import {
  StoreActionTypes,
  FetchStoreListAction,
  FetchStoreDetailsAction,
  SaveListAction,
  ArchiveStoreAction,
  ArchiveStoreSuccessAction,
  CreateStoreAction,
  CreateStoreSuccessAction,
  SaveCurrentStoreAction,
  UpdateStoreAction,
  FetchStoreTableListAction,
  SaveStoreTableListAction,
  CreateStoreTableAction,
  UpdateStoreTableAction,
  SaveCurrentStoreTableAction,
  RemoveStoreTableAction,
  RemoveStoreTableSuccessAction,
  FetchAllStoresAction,
  SaveAllStoresAction,
} from '../_actions/store.actions';
import { selectStorePagination, selectStoreTablePagination } from '../_selectors/store.selectors';
import { RequestParamModel, ResponseStatus } from '@app/core/models/common';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import {
  AddLoadingAction,
  RemoveLoadingAction,
} from '@app/core/actions/loading.actions';
import { StoreService } from '../_services';

@Injectable()
export class StoreEffects {
  @Effect()
  fetchList$ = this.actions$.pipe(
    ofType<FetchStoreListAction>(StoreActionTypes.FetchList),
    withLatestFrom(this.store.pipe(select(selectStorePagination()))),
    switchMap(([_, pagination]) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: StoreActionTypes.FetchList })
      );

      const params = new RequestParamModel();
      params.pageIndex = pagination.pageIndex;
      params.pageSize = pagination.pageSize;
      params.keyword = pagination.keyword;

      return this.storeSvc.fetchStoreList(params);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.FetchList,
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
          currentAction: StoreActionTypes.FetchList,
        })
      );
      return caught;
    })
  );

  @Effect()
	fetchAllStores$ = this.actions$.pipe(
		ofType<FetchAllStoresAction>(StoreActionTypes.FetchAllStores),
		switchMap(() => {
			this.store.dispatch(
				new AddLoadingAction({ currentAction: StoreActionTypes.FetchAllStores })
			);

			return this.storeSvc.fetchAllStores();
		}),
		map((rs) => {
			this.store.dispatch(
				new RemoveLoadingAction({
					currentAction: StoreActionTypes.FetchAllStores,
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
					currentAction: StoreActionTypes.FetchAllStores,
				})
			);
			return caught;
		})
	);

  @Effect()
  fetchStoreDetails = this.actions$.pipe(
    ofType<FetchStoreDetailsAction>(
      StoreActionTypes.FetchStoreDetails
    ),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: StoreActionTypes.FetchStoreDetails,
        })
      );

      return this.storeSvc.fetchStoreById(payload.storeId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.FetchStoreDetails,
        })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveCurrentStoreAction({ store: rs.data.store });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.FetchStoreDetails,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  createStore$ = this.actions$.pipe(
    ofType<CreateStoreAction>(StoreActionTypes.CreateStore),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: StoreActionTypes.CreateStore,
        })
      );

      return this.storeSvc.createStore(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.CreateStore,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new CreateStoreSuccessAction({ store: rs.data.store });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  updateStore$ = this.actions$.pipe(
    ofType<UpdateStoreAction>(StoreActionTypes.UpdateStore),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: StoreActionTypes.UpdateStore,
        })
      );
      return this.storeSvc.updateStore(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.UpdateStore,
        })
      );

      if (!rs) {
        throw new Error('');
      }
      return new SaveCurrentStoreAction({ store: rs.data.store });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.UpdateStore,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  archiveStore$ = this.actions$.pipe(
    ofType<ArchiveStoreAction>(StoreActionTypes.ArchiveStore),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: StoreActionTypes.ArchiveStore,
        })
      );
      return this.storeSvc.archiveStore(payload.storeId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.ArchiveStore,
        })
      );
      if (!rs) {
        throw new Error('');
      }

      this.store.dispatch(new FetchStoreListAction());
      return new ArchiveStoreSuccessAction({
        isSuccess: rs.status === ResponseStatus.SUCCESS,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.ArchiveStore,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  // Store Table
  @Effect()
  fetchStoreTableList$ = this.actions$.pipe(
    ofType<FetchStoreTableListAction>(StoreActionTypes.FetchStoreTableList),
    withLatestFrom(this.store.pipe(select(selectStoreTablePagination()))),
    switchMap(([_, pagination]) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: StoreActionTypes.FetchStoreTableList })
      );

      const params = new RequestParamModel();
      params.pageIndex = pagination.pageIndex;
      params.pageSize = pagination.pageSize;
      params.keyword = pagination.keyword;

      return this.storeSvc.fetchStoreTableList(_.payload.storeId, params);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.FetchStoreTableList,
        })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveStoreTableListAction({ response: rs.data });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.FetchStoreTableList,
        })
      );
      return caught;
    })
  );

  @Effect()
  createStoreTable$ = this.actions$.pipe(
    ofType<CreateStoreTableAction>(StoreActionTypes.CreateStoreTable),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: StoreActionTypes.CreateStoreTable,
        })
      );

      return this.storeSvc.createStoreTable(payload.data).pipe(
        map((rs) => {
          this.store.dispatch(new FetchStoreTableListAction({ storeId: payload.data.storeId }));
          return rs;
        })
      );
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.CreateStoreTable,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new SaveCurrentStoreTableAction({ storeTable: rs.data });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  updateStoreTable$ = this.actions$.pipe(
    ofType<UpdateStoreTableAction>(StoreActionTypes.UpdateStoreTable),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: StoreActionTypes.UpdateStoreTable,
        })
      );
      return this.storeSvc.updateStoreTable(payload.tableId, payload.name).pipe(
        map((rs) => {
          this.store.dispatch(new FetchStoreTableListAction({ storeId: payload.storeId }));
          return rs;
        })
      );
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.UpdateStoreTable,
        })
      );

      if (!rs) {
        throw new Error('');
      }
      return new SaveCurrentStoreTableAction({ storeTable: rs.data });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.UpdateStoreTable,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  removeStoreTable$ = this.actions$.pipe(
    ofType<RemoveStoreTableAction>(StoreActionTypes.RemoveStoreTable),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: StoreActionTypes.RemoveStoreTable,
        })
      );
      return this.storeSvc.removeStoreTable(payload.tableId).pipe(
        map((rs) => {
          if (rs) {
            this.store.dispatch(new FetchStoreTableListAction({ storeId: payload.storeId }));
          }

          return rs;
        })
      );
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.RemoveStoreTable,
        })
      );
      if (!rs) {
        throw new Error('');
      }

      return new RemoveStoreTableSuccessAction({
        isSuccess: rs.status === ResponseStatus.SUCCESS,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: StoreActionTypes.RemoveStoreTable,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  constructor(
    private actions$: Actions,
    private storeSvc: StoreService,
    private store: Store<AppState>,
    private toastService: ToastService
  ) { }
}
