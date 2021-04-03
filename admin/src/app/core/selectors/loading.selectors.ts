import { find } from 'lodash';
// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// State
import { LoadingState } from '../reducers/loading.reducers';

export const selectLoadingState = createFeatureSelector<LoadingState>(
  'loading'
);

export const selectActionLoading = createSelector(
  selectLoadingState,
  (state: LoadingState, actionTracking: string) => {
    return !!find(state.loadingActions, i => i === actionTracking);
  },
);

export const selectPageLoading = createSelector(
  selectLoadingState,
  (loadingState) => {
    return loadingState.loadingActions && loadingState.loadingActions.length > 0;
  }
);
