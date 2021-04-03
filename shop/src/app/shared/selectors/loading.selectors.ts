import { createFeatureSelector, createSelector } from '@ngrx/store';
import { find } from 'lodash-es';

import { LoadingState } from '../reducers/loading.reducers';

export const selectLoadingState = createFeatureSelector<LoadingState>('loading');

export const selectLoading = createSelector(
  selectLoadingState,
  (state: LoadingState, actionTracking: string) => {
    return !!find(state.loadingActions, i => i === actionTracking);
  },
);

export const selectIsAvailableLoading = createSelector(
  selectLoadingState,
  (loadingState) => {
    return loadingState.loadingActions && loadingState.loadingActions.length > 0;
  }
);
