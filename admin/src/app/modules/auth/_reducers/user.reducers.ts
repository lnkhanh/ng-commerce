// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { UserActions, UserActionTypes } from '../_actions/user.actions';
// Models
import { UserType } from '../_models/user.model';
import produce from 'immer';

// tslint:disable-next-line:no-empty-interface
export interface UserState extends EntityState<UserType> {
  showInitWaitingMessage: boolean;
  list: UserType[];
  currentUser?: UserType;
  pagination: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
    totalPages: number;
    totalItems: number;
  };
}

export const adapter: EntityAdapter<UserType> = createEntityAdapter<UserType>();

export const initialUserState: UserState = produce(
  adapter.getInitialState({
    showInitWaitingMessage: true,
    list: [],
    currentUser: null,
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

export function usersReducer(
  state = initialUserState,
  action: UserActions
): UserState {
  return produce(state, (draft) => {
    switch (action.type) {
      case UserActionTypes.SaveList: {
        const { response } = action.payload;
        draft.list = response.records;
        draft.pagination.totalItems = response.totalItems;
        draft.pagination.totalPages = response.pages;

        break;
      }
      case UserActionTypes.SaveRequestParams: {
          const { params } = action.payload;
          const { pageIndex, pageSize, keyword } = params;

          draft.pagination.pageIndex = pageIndex;
          draft.pagination.pageSize = pageSize;
          draft.pagination.keyword = keyword;

          break;
      }
      case UserActionTypes.FetchUserDetails: {
        draft.currentUser = null;
        break;
      }
      case UserActionTypes.CreateUser: {
        draft.currentUser = null;
        break;
      }
      case UserActionTypes.CreateUserSuccess:
      case UserActionTypes.SaveUserDetails: {
        const { user } = action.payload;
        draft.currentUser = user;
        break;
      }
      default:
        return state;
    }
  });
}

export const getUserState = createFeatureSelector<UserState>('users');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
