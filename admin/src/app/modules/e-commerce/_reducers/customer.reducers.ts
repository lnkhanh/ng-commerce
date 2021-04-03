import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CustomerActions, CustomerActionTypes } from '../_actions/customer.actions';
import { UserType } from '@app/modules/auth/_models/user.model';
import produce from 'immer';

// tslint:disable-next-line:no-empty-interface
export interface CustomerState extends EntityState<UserType> {
  showInitWaitingMessage: boolean;
  list: UserType[];
  currentCustomer?: UserType;
  pagination: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
    totalPages: number;
    totalItems: number;
  };
}

export const adapter: EntityAdapter<UserType> = createEntityAdapter<UserType>();

export const initialCustomerState: CustomerState = produce(
  adapter.getInitialState({
    showInitWaitingMessage: true,
    list: [],
    currentCustomer: null,
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

export function customersReducer(
  state = initialCustomerState,
  action: CustomerActions
): CustomerState {
  return produce(state, (draft) => {
    switch (action.type) {
      case CustomerActionTypes.SaveList: {
        const { response } = action.payload;
        draft.list = response.records;
        draft.pagination.totalItems = response.totalItems;
        draft.pagination.totalPages = response.pages;

        break;
      }
      case CustomerActionTypes.SaveRequestParams: {
          const { params } = action.payload;
          const { pageIndex, pageSize, keyword } = params;

          draft.pagination.pageIndex = pageIndex;
          draft.pagination.pageSize = pageSize;
          draft.pagination.keyword = keyword;

          break;
      }
      case CustomerActionTypes.FetchCustomerDetails: {
        draft.currentCustomer = null;
        break;
      }
      case CustomerActionTypes.CreateCustomer: {
        draft.currentCustomer = null;
        break;
      }
      case CustomerActionTypes.CreateCustomerSuccess:
      case CustomerActionTypes.SaveCustomerDetails: {
        const { customer } = action.payload;
        draft.currentCustomer = customer;
        break;
      }
      default:
        return state;
    }
  });
}

export const getCustomerState = createFeatureSelector<CustomerState>('customers');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
