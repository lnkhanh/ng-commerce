import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CategoryActions, CategoryActionTypes } from '../_actions/category.actions';
import { CategoryType } from '@app/modules/e-commerce/_models/category.model';
import produce from 'immer';

export interface CategoryState extends EntityState<CategoryType> {
  showInitWaitingMessage: boolean;
  list: CategoryType[];
  currentCategory?: CategoryType;
  pagination: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
    totalPages: number;
    totalItems: number;
  };
}

export const adapter: EntityAdapter<CategoryType> = createEntityAdapter<
  CategoryType
>();

export const initialCategoryState: CategoryState = produce(
  adapter.getInitialState({
    showInitWaitingMessage: true,
    list: [],
    currentCategory: null,
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
      totalPages: 0,
      totalItems: 0,
    },
  }),
  (draft) => draft
);

export function categoryReducer(
  state = initialCategoryState,
  action: CategoryActions
): CategoryState {
  return produce(state, (draft) => {
    switch (action.type) {
      case CategoryActionTypes.SaveList: {
        const { response } = action.payload;
        draft.list = response.records;
        draft.pagination.totalItems = response.totalItems;
        draft.pagination.totalPages = response.pages;

        break;
      }
      case CategoryActionTypes.SaveRequestParams: {
        const { params } = action.payload;
        const { pageIndex, pageSize, keyword } = params;

        draft.pagination.pageIndex = pageIndex;
        draft.pagination.pageSize = pageSize;
        draft.pagination.keyword = keyword;

        break;
      }
      case CategoryActionTypes.FetchCategoryDetails: {
        draft.currentCategory = null;
        break;
      }
      case CategoryActionTypes.CreateCategory: {
        draft.currentCategory = null;
        break;
      }
      case CategoryActionTypes.CreateCategorySuccess:
      case CategoryActionTypes.SaveCategoryDetails: {
        const { category } = action.payload;
        draft.currentCategory = category;
        break;
      }
      default:
        return state;
    }
  });
}

export const getCategoryState = createFeatureSelector<CategoryState>('Categories');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
