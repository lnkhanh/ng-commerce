import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../_reducers/user.reducers';

export const selectUserState = createFeatureSelector<UserState>('users');

export const selectPagination = () =>
  createSelector(selectUserState, (state) => state.pagination);

export const selectList = () =>
  createSelector(selectUserState, (state) => state.list);

export const selectCurrentUser = () =>
  createSelector(selectUserState, (state) => state.currentUser);
