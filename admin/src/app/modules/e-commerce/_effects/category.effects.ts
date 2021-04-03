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
  CategoryActionTypes,
  FetchCategoryListAction,
  FetchCategoryDetailsAction,
  SaveListAction,
  ArchiveCategoryAction,
  ArchiveCategorySuccessAction,
  CreateCategoryAction,
  CreateCategorySuccessAction,
  SaveCurrentCategoryAction,
  UpdateCategoryAction,
} from '../_actions/category.actions';
import { selectCategoryPagination } from '../_selectors/category.selectors';
import { RequestParamModel, ResponseStatus } from '@app/core/models/common';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import {
  AddLoadingAction,
  RemoveLoadingAction,
} from '@app/core/actions/loading.actions';
import { CategoryService } from '../_services';

@Injectable()
export class CategoryEffects {
  @Effect()
  fetchList$ = this.actions$.pipe(
    ofType<FetchCategoryListAction>(CategoryActionTypes.FetchCategoryList),
    withLatestFrom(this.store.pipe(select(selectCategoryPagination()))),
    switchMap(([_, pagination]) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: CategoryActionTypes.FetchCategoryList })
      );

      const params = new RequestParamModel();
      params.pageIndex = pagination.pageIndex;
      params.pageSize = pagination.pageSize;
      params.keyword = pagination.keyword;

      return this.categorySvc.fetchCategoryList(params);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CategoryActionTypes.FetchCategoryList,
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
          currentAction: CategoryActionTypes.FetchCategoryList,
        })
      );
      return caught;
    })
  );

  @Effect()
  fetchCategoryDetails = this.actions$.pipe(
    ofType<FetchCategoryDetailsAction>(
      CategoryActionTypes.FetchCategoryDetails
    ),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: CategoryActionTypes.FetchCategoryDetails,
        })
      );

      return this.categorySvc.fetchCategoryById(payload.categoryId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CategoryActionTypes.FetchCategoryDetails,
        })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveCurrentCategoryAction({ category: rs.data.category });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CategoryActionTypes.FetchCategoryDetails,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  deleteCategory$ = this.actions$.pipe(
    ofType<ArchiveCategoryAction>(CategoryActionTypes.ArchiveCategory),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: CategoryActionTypes.ArchiveCategory,
        })
      );
      return this.categorySvc.archiveCategory(payload.categoryId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CategoryActionTypes.ArchiveCategory,
        })
      );
      if (!rs) {
        throw new Error('');
      }

      this.store.dispatch(new FetchCategoryListAction());
      return new ArchiveCategorySuccessAction({
        isSuccess: rs.status === ResponseStatus.SUCCESS,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CategoryActionTypes.ArchiveCategory,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  updateCategory$ = this.actions$.pipe(
    ofType<UpdateCategoryAction>(CategoryActionTypes.UpdateCategory),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: CategoryActionTypes.UpdateCategory,
        })
      );
      return this.categorySvc.updateCategory(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CategoryActionTypes.UpdateCategory,
        })
      );

      if (!rs) {
        throw new Error('');
      }
      this.store.dispatch(new FetchCategoryListAction());
      return new SaveCurrentCategoryAction({ category: rs.data.category });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CategoryActionTypes.ArchiveCategory,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  createCategory$ = this.actions$.pipe(
    ofType<CreateCategoryAction>(CategoryActionTypes.CreateCategory),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: CategoryActionTypes.CreateCategory,
        })
      );

      return this.categorySvc.createCategory(payload.data);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: CategoryActionTypes.CreateCategory,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }

      this.store.dispatch(new FetchCategoryListAction());
      return new CreateCategorySuccessAction({ category: rs.data.category });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  constructor(
    private actions$: Actions,
    private categorySvc: CategoryService,
    private store: Store<AppState>,
    private toastService: ToastService
  ) {}
}
