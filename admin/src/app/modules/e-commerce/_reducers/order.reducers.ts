import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { OrderActions, OrderActionTypes } from '../_actions/order.actions';
import { OrderType } from '@app/modules/e-commerce/_models/order.model';
import produce from 'immer';

export interface OrderState extends EntityState<OrderType> {
  showInitWaitingMessage: boolean;
  list: OrderType[];
  currentOrder?: OrderType;
  pagination: {
    pageIndex: number;
    pageSize: number;
    keyword: string;
    totalPages: number;
    totalItems: number;
  };
}

export const adapter: EntityAdapter<OrderType> = createEntityAdapter<
  OrderType
>();

export const initialOrderState: OrderState = produce(
  adapter.getInitialState({
    showInitWaitingMessage: true,
    list: [],
    currentOrder: null,
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

export function orderReducer(
  state = initialOrderState,
  action: OrderActions
): OrderState {
  return produce(state, (draft) => {
    switch (action.type) {
      case OrderActionTypes.SaveList: {
        const { response } = action.payload;
        draft.list = response.records;
        draft.pagination.totalItems = response.totalItems;
        draft.pagination.totalPages = response.pages;

        break;
      }
      case OrderActionTypes.SaveRequestParams: {
        const { params } = action.payload;
        const { pageIndex, pageSize, keyword } = params;

        draft.pagination.pageIndex = pageIndex;
        draft.pagination.pageSize = pageSize;
        draft.pagination.keyword = keyword;

        break;
      }
      // case OrderActionTypes.FetchOrderDetails: {
      //   draft.currentOrder = null;
      //   break;
      // }
      case OrderActionTypes.CreateOrder: {
        draft.currentOrder = null;
        break;
      }
      case OrderActionTypes.CreateOrderSuccess:
      case OrderActionTypes.SaveOrderDetails: {
        const { order } = action.payload;
        draft.currentOrder = order;
        break;
      }
      default:
        return state;
    }
  });
}

export const getOrderState = createFeatureSelector<OrderState>('orders');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
