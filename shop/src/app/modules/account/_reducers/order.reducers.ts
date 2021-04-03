import produce from 'immer';
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { OrderActions, OrderActionTypes } from '../_actions/order.actions';
import { OrderType } from '@app/modules/home/_models/order.model';

export interface orderState extends EntityState<OrderType> {
	orders: OrderType[];
	orderDetails: OrderType;
	pagination: {
		pageIndex: number;
		pageSize: number;
		totalPages: number;
		totalItems: number;
	};
}

export const adapter: EntityAdapter<OrderType> = createEntityAdapter<
OrderType
>();

export const initialOrderState: orderState = produce(
	adapter.getInitialState({
		orders: [],
		orderDetails: null,
		pagination: {
			pageIndex: 1,
			pageSize: 10,
			totalPages: 0,
			totalItems: 0,
		},
	}),
	(draft) => draft
);

export function orderReducer(
	state = initialOrderState,
	action: OrderActions
): orderState {
	return produce(state, (draft) => {
		switch (action.type) {
			case OrderActionTypes.SaveOrderCriteria: {
				const { pageSize, pageIndex } = action.criteria;

				draft.pagination.pageIndex = pageIndex;
				draft.pagination.pageSize = pageSize;

				break;
			}
			case OrderActionTypes.SaveOrders: {
				const { records, totalItems, pages } = {...action.response};
				draft.orders = records;
				draft.pagination.totalItems = totalItems;
				draft.pagination.totalPages = pages;

				break;
			}
			case OrderActionTypes.SaveOrderDetails: {
				draft.orderDetails = action.order;
				break;
			}
			default: return state;
		}
		return draft;
	});
}

export const getOrderState = createFeatureSelector<orderState>('order');
