import { Injectable } from '@angular/core';
import {
  mergeMap,
  map,
  switchMap,
  withLatestFrom,
  catchError,
} from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
import { AppState } from '@core/reducers';
import {
  ProductActionTypes,
  FetchListAction,
  FetchProductDetailsAction,
  SaveListAction,
  ArchiveProductAction,
  ArchiveProductSuccessAction,
  CreateProductAction,
  CreateProductSuccessAction,
  SaveCurrentProductAction,
  UpdateProductAction,
  UploadProductPhotosAction,
} from '../_actions/product.actions';
import { selectProductPagination } from '../_selectors/product.selectors';
import { RequestParamModel, ResponseStatus } from '@app/core/models/common';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import {
  AddLoadingAction,
  RemoveLoadingAction,
} from '@app/core/actions/loading.actions';
import { ProductService } from '../_services';

@Injectable()
export class ProductEffects {
  @Effect()
  fetchList$ = this.actions$.pipe(
    ofType<FetchListAction>(ProductActionTypes.FetchList),
    withLatestFrom(this.store.pipe(select(selectProductPagination()))),
    switchMap(([_, pagination]) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: ProductActionTypes.FetchList })
      );

      const params = new RequestParamModel();
      params.pageIndex = pagination.pageIndex;
      params.pageSize = pagination.pageSize;
      params.keyword = pagination.keyword;

      return this.productSvc.fetchProductList(params);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: ProductActionTypes.FetchList,
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
          currentAction: ProductActionTypes.FetchList,
        })
      );
      return caught;
    })
  );

  @Effect()
  fetchProductDetails = this.actions$.pipe(
    ofType<FetchProductDetailsAction>(
      ProductActionTypes.FetchProductDetails
    ),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: ProductActionTypes.FetchProductDetails,
        })
      );

      return this.productSvc.fetchProductById(payload.productId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: ProductActionTypes.FetchProductDetails,
        })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveCurrentProductAction({ product: rs.data.product });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: ProductActionTypes.FetchProductDetails,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  deleteProduct$ = this.actions$.pipe(
    ofType<ArchiveProductAction>(ProductActionTypes.ArchiveProduct),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: ProductActionTypes.ArchiveProduct,
        })
      );
      return this.productSvc.archiveProduct(payload.productId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: ProductActionTypes.ArchiveProduct,
        })
      );
      if (!rs) {
        throw new Error('');
      }

      this.store.dispatch(new FetchListAction());
      return new ArchiveProductSuccessAction({
        isSuccess: rs.status === ResponseStatus.SUCCESS,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: ProductActionTypes.ArchiveProduct,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  updateProduct$ = this.actions$.pipe(
    ofType<UpdateProductAction>(ProductActionTypes.UpdateProduct),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: ProductActionTypes.UpdateProduct,
        })
      );
      return this.productSvc.updateProduct(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: ProductActionTypes.UpdateProduct,
        })
      );

      if (!rs) {
        throw new Error('');
      }
      return new SaveCurrentProductAction({ product: rs.data.product });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: ProductActionTypes.ArchiveProduct,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  uploadProductPhotos$ = this.actions$.pipe(
    ofType<UploadProductPhotosAction>(ProductActionTypes.UploadProductPhotos),
    switchMap(({ payload }) => {
      return this.productSvc.uploadProductPhotos(payload.productId, payload.formData);
    }),
    map(rs => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: ProductActionTypes.UploadProductPhotos,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new SaveCurrentProductAction({ product: rs.data.product });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: ProductActionTypes.UploadProductPhotos,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  createProduct$ = this.actions$.pipe(
    ofType<CreateProductAction>(ProductActionTypes.CreateProduct),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: ProductActionTypes.CreateProduct,
        })
      );

      return this.productSvc.createProduct(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: ProductActionTypes.CreateProduct,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new CreateProductSuccessAction({ product: rs.data.product });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  constructor(
    private actions$: Actions,
    private productSvc: ProductService,
    private store: Store<AppState>,
    private toastService: ToastService
  ) { }
}
