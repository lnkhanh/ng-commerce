import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { OptionSetActions, OptionSetActionTypes } from '../_actions/option-set.actions';
import { OptionSet } from '@app/modules/e-commerce/_models/option-set.model';
import produce from 'immer';

export interface OptionSetState extends EntityState<OptionSet> {
  list: OptionSet[];
  currentOptionSet?: OptionSet;
  pagination: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
    totalPages: number;
    totalItems: number;
  };
}

export const adapter: EntityAdapter<OptionSet> = createEntityAdapter<
  OptionSet
>();

export const initialOptionSetState: OptionSetState = produce(
  adapter.getInitialState({
    list: [],
    currentOptionSet: null,
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keyword: '',
      totalPages: 0,
      totalItems: 0,
    }
  }),
  (draft) => draft
);

export function optionSetReducer(
  state = initialOptionSetState,
  action: OptionSetActions
): OptionSetState {
  return produce(state, (draft) => {
    switch (action.type) {
      case OptionSetActionTypes.SaveList: {
        const { response } = action.payload;
        draft.list = response.records;
        draft.pagination.totalItems = response.totalItems;
        draft.pagination.totalPages = response.pages;

        break;
      }
      case OptionSetActionTypes.SaveRequestParams: {
        const { params } = action.payload;
        const { pageIndex, pageSize, keyword } = params;

        draft.pagination.pageIndex = pageIndex;
        draft.pagination.pageSize = pageSize;
        draft.pagination.keyword = keyword;

        break;
      }
      case OptionSetActionTypes.FetchOptionSetDetails: {
        draft.currentOptionSet = null;
        break;
      }
      case OptionSetActionTypes.CreateOptionSet: {
        draft.currentOptionSet = null;
        break;
      }
      case OptionSetActionTypes.CreateOptionSetSuccess:
      case OptionSetActionTypes.SaveOptionSetDetails: {
        const { optionSet } = action.payload;
        draft.currentOptionSet = optionSet;
        break;
      }
      default:
        return state;
    }
  });
}

export const getOptionSetState = createFeatureSelector<OptionSetState>('optionSets');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
