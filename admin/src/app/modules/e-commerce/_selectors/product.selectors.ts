import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../_reducers/product.reducers';

export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectProductPagination = () =>
  createSelector(selectProductState, (state) => state.pagination);

export const selectProductList = () =>
  createSelector(selectProductState, (state) => state.list);

export const selectCurrentProduct = () =>
  createSelector(selectProductState, (state) => state.currentProduct);

export const selectCurrentProductPhotos = () => createSelector(selectProductState, (state) => {
  if (!state.currentProduct) {
    return [];
  }

  return state.currentProduct.images;
});
