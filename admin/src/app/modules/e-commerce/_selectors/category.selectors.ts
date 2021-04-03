import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from '../_reducers/category.reducers';

export const selectCategoryState = createFeatureSelector<CategoryState>('categories');

export const selectCategoryPagination = () =>
  createSelector(selectCategoryState, (state) => state.pagination);

export const selectCategoryList = () =>
  createSelector(selectCategoryState, (state) => state.list);

export const selectCurrentCategory = () =>
  createSelector(selectCategoryState, (state) => state.currentCategory);
