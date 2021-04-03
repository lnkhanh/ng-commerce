import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OptionSetState } from '../_reducers/option-set.reducers';

export const selectOptionSetState = createFeatureSelector<OptionSetState>('optionSets');

export const selectOptionSetPagination = () =>
  createSelector(selectOptionSetState, (state) => state.pagination);

export const selectOptionSetList = () =>
  createSelector(selectOptionSetState, (state) => state.list);

export const selectCurrentOptionSet = () =>
  createSelector(selectOptionSetState, (state) => state.currentOptionSet);

