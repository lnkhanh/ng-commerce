import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { StoreActions, StoreActionTypes } from '../_actions/store.actions';
import { StoreTableType, StoreType } from '@app/modules/e-commerce/_models/store.model';
import produce from 'immer';

export interface StoreState extends EntityState<StoreType> {
  showInitWaitingMessage: boolean;
  list: StoreType[];
	allStores: StoreType[];
  currentStore?: StoreType;
  pagination: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
    totalPages: number;
    totalItems: number;
  };

  // Store Table
  listStoreTable: StoreTableType[];
  currentStoreTable?: StoreTableType;
  paginationStoreTable: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
    totalPages: number;
    totalItems: number;
  };
}

export const adapter: EntityAdapter<StoreType> = createEntityAdapter<
  StoreType
>();

export const initialStoreState: StoreState = produce(
  adapter.getInitialState({
    showInitWaitingMessage: true,
    list: [],
		allStores: [],
    currentStore: null,
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
      totalPages: 0,
      totalItems: 0,
    },

    listStoreTable: [],
    currentStoreTable: null,
    paginationStoreTable: {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
      totalPages: 0,
      totalItems: 0,
    },
  }),
  (draft) => draft
);

export function storeReducer(
  state = initialStoreState,
  action: StoreActions
): StoreState {
  return produce(state, (draft) => {
    switch (action.type) {
      case StoreActionTypes.SaveList: {
        const { response } = action.payload;
        draft.list = response.records;
        draft.pagination.totalItems = response.totalItems;
        draft.pagination.totalPages = response.pages;

        break;
      }
      case StoreActionTypes.SaveAllStoreList: {
				const { response } = action.payload;
				draft.allStores = response;
				break;
			}
      case StoreActionTypes.SaveRequestParams: {
        const { params } = action.payload;
        const { pageIndex, pageSize, keyword } = params;

        draft.pagination.pageIndex = pageIndex;
        draft.pagination.pageSize = pageSize;
        draft.pagination.keyword = keyword;

        break;
      }
      case StoreActionTypes.FetchStoreDetails: {
        draft.currentStore = null;
        break;
      }
      case StoreActionTypes.CreateStore: {
        draft.currentStore = null;
        break;
      }
      case StoreActionTypes.CreateStoreSuccess:
      case StoreActionTypes.SaveStoreDetails: {
        const { store } = action.payload;
        draft.currentStore = store;
        break;
      }

      // Store Table
      case StoreActionTypes.SaveStoreTableList: {
        const { response } = action.payload;
        draft.listStoreTable = response.records;
        draft.paginationStoreTable.totalItems = response.totalItems;
        draft.paginationStoreTable.totalPages = response.pages;

        break;
      }
      case StoreActionTypes.SaveStoreTableRequestParams: {
        const { params } = action.payload;
        const { pageIndex, pageSize, keyword } = params;

        draft.paginationStoreTable.pageIndex = pageIndex;
        draft.paginationStoreTable.pageSize = pageSize;
        draft.paginationStoreTable.keyword = keyword;

        break;
      }
      case StoreActionTypes.CreateStoreTable: {
        draft.currentStoreTable = null;
        break;
      }
      case StoreActionTypes.SaveStoreTable: {
        const { storeTable } = action.payload;
        draft.currentStoreTable = storeTable;
        break;
      }
      default:
        return state;
    }
  });
}

export const getStoreState = createFeatureSelector<StoreState>('stores');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
