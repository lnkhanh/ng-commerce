import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ProductActions, ProductActionTypes } from '../_actions/product.actions';
import { ProductType } from '@app/modules/e-commerce/_models/product.model';
import produce from 'immer';

export interface ProductState extends EntityState<ProductType> {
  showInitWaitingMessage: boolean;
  list: ProductType[];
  currentProduct?: ProductType;
  pagination: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
    totalPages: number;
    totalItems: number;
  };
}

export const adapter: EntityAdapter<ProductType> = createEntityAdapter<ProductType>();

export const initialProductState: ProductState = produce(
  adapter.getInitialState({
    showInitWaitingMessage: true,
    list: [],
    currentProduct: null,
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
      totalPages: 0,
      totalItems: 0
    },
  }),
  draft => draft
);

export function productReducer(
  state = initialProductState,
  action: ProductActions
): ProductState {
  return produce(state, (draft) => {
    switch (action.type) {
      case ProductActionTypes.SaveList: {
        const { response } = action.payload;
        draft.list = response.records;
        draft.pagination.totalItems = response.totalItems;
        draft.pagination.totalPages = response.pages;

        break;
      }
      case ProductActionTypes.SaveRequestParams: {
          const { params } = action.payload;
          const { pageIndex, pageSize, keyword } = params;

          draft.pagination.pageIndex = pageIndex;
          draft.pagination.pageSize = pageSize;
          draft.pagination.keyword = keyword;

          break;
      }
      case ProductActionTypes.FetchProductDetails: {
        draft.currentProduct = null;
        break;
      }
      case ProductActionTypes.CreateProduct: {
        draft.currentProduct = null;
        break;
      }
      case ProductActionTypes.CreateProductSuccess:
      case ProductActionTypes.SaveProductDetails: {
        const { product } = action.payload;
        draft.currentProduct = product;
        break;
      }
      default:
        return state;
    }
  });
}

export const getProductState = createFeatureSelector<ProductState>('products');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
