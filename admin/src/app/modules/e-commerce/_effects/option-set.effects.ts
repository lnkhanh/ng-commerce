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
  OptionSetActionTypes,
  FetchOptionSetListAction,
  SaveOptionSetListAction,
  CreateOptionSetAction,
  CreateOptionSetSuccessAction,
  FetchOptionSetDetailsAction,
  UpdateOptionSetAction,
  SaveCurrentOptionSetAction,
  RemoveOptionSetAction,
  RemoveOptionSetSuccessAction
} from '../_actions/option-set.actions';
import { selectOptionSetPagination } from '../_selectors/option-set.selectors';
import { RequestParamModel, ResponseStatus } from '@app/core/models/common';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import {
  AddLoadingAction,
  RemoveLoadingAction,
} from '@app/core/actions/loading.actions';
import { OptionSetService } from '../_services';

@Injectable()
export class OptionSetEffects {
  @Effect()
  fetchList$ = this.actions$.pipe(
    ofType<FetchOptionSetListAction>(OptionSetActionTypes.FetchList),
    withLatestFrom(this.store.pipe(select(selectOptionSetPagination()))),
    switchMap(([_, pagination]) => {
      this.store.dispatch(
        new AddLoadingAction({ currentAction: OptionSetActionTypes.FetchList })
      );

      const params = new RequestParamModel();
      params.pageIndex = pagination.pageIndex;
      params.pageSize = pagination.pageSize;
      params.keyword = pagination.keyword;

      return this.optionSetSvc.fetchOptionSets(params);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OptionSetActionTypes.FetchList,
        })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveOptionSetListAction({ response: rs.data });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OptionSetActionTypes.FetchList,
        })
      );
      return caught;
    })
  );

  @Effect()
  fetchOptionSetDetails = this.actions$.pipe(
    ofType<FetchOptionSetDetailsAction>(
      OptionSetActionTypes.FetchOptionSetDetails
    ),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: OptionSetActionTypes.FetchOptionSetDetails,
        })
      );

      return this.optionSetSvc.fetchOptionSetById(payload.optionSetId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OptionSetActionTypes.FetchOptionSetDetails,
        })
      );
      if (!rs || !rs.data) {
        throw new Error('');
      }

      return new SaveCurrentOptionSetAction({ optionSet: rs.data });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OptionSetActionTypes.FetchOptionSetDetails,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  createOptionSet$ = this.actions$.pipe(
    ofType<CreateOptionSetAction>(OptionSetActionTypes.CreateOptionSet),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: OptionSetActionTypes.CreateOptionSet,
        })
      );

      return this.optionSetSvc.createOptionSet(payload);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OptionSetActionTypes.CreateOptionSet,
        })
      );

      if (!rs || rs.status === ResponseStatus.FAILED) {
        throw new Error('');
      }
      return new CreateOptionSetSuccessAction({ optionSet: rs.data });
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  updateOptionSet$ = this.actions$.pipe(
    ofType<UpdateOptionSetAction>(OptionSetActionTypes.UpdateOptionSet),
    mergeMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: OptionSetActionTypes.UpdateOptionSet,
        })
      );
      return this.optionSetSvc.updateOptionSet(payload);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OptionSetActionTypes.UpdateOptionSet,
        })
      );

      if (!rs) {
        throw new Error('');
      }
      
      return new SaveCurrentOptionSetAction({ optionSet: rs.data });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OptionSetActionTypes.UpdateOptionSet,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  @Effect()
  removeOptionSet$ = this.actions$.pipe(
    ofType<RemoveOptionSetAction>(OptionSetActionTypes.RemoveOptionSet),
    switchMap(({ payload }) => {
      this.store.dispatch(
        new AddLoadingAction({
          currentAction: OptionSetActionTypes.RemoveOptionSet,
        })
      );
      return this.optionSetSvc.removeOptionSet(payload.optionSetId);
    }),
    map((rs) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OptionSetActionTypes.RemoveOptionSet,
        })
      );
      if (!rs) {
        throw new Error('');
      }

      this.store.dispatch(new FetchOptionSetListAction());
      return new RemoveOptionSetSuccessAction({
        isSuccess: rs.status === ResponseStatus.SUCCESS,
      });
    }),
    catchError((error, caught) => {
      this.store.dispatch(
        new RemoveLoadingAction({
          currentAction: OptionSetActionTypes.RemoveOptionSet,
        })
      );
      this.toastService.showDanger('Ops! Something went wrong.');
      return caught;
    })
  );

  constructor(
    private actions$: Actions,
    private optionSetSvc: OptionSetService,
    private store: Store<AppState>,
    private toastService: ToastService
  ) { }
}
