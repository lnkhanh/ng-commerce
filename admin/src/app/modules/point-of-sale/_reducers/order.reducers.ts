import produce from 'immer';
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { OrderType } from '@app/modules/e-commerce';
import { PosOrderActions, PosOrderActionTypes } from '../_actions/order.actions';
import { OrderDetails } from '../_models/pos.model';

export interface PosOrderState extends EntityState<OrderType> {
	list: OrderType[];
	currentOrder?: OrderDetails;
	showInitWaitingMessage: boolean;
	pagination: {
		pageIndex: number;
		pageSize: number;
		keyword: string;
		totalPages: number;
		totalItems: number;
	};
}

export const adapter: EntityAdapter<OrderType> = createEntityAdapter<OrderType>();

export const initialPosOrderState: PosOrderState = produce(
	adapter.getInitialState({
		showInitWaitingMessage: true,
		list: [],
		pagination: {
			pageIndex: 1,
			pageSize: 10,
			keyword: '',
			totalPages: 0,
			totalItems: 0,
		},
	}),
	draft => draft
);

export function posOrderReducer(
	state = initialPosOrderState,
	action: PosOrderActions
): PosOrderState {
	return produce(state, (draft) => {
		switch (action.type) {
			case PosOrderActionTypes.SaveOrderList: {
				const { response } = action.payload;
    draft.list = response.records;
    draft.pagination.totalItems = response.totalItems;
				draft.pagination.totalPages = response.pages;

				break;
			}
      case PosOrderActionTypes.SaveOrderRequestParams: {
        const { params } = action.payload;
        const { pageIndex, pageSize, keyword } = params;

        draft.pagination.pageIndex = pageIndex;
        draft.pagination.pageSize = pageSize;
        draft.pagination.keyword = keyword;

        break;
      }
			case PosOrderActionTypes.SaveOrderDetails: {
				const { order } = action.payload;
				draft.currentOrder = order;
				break;
			}
			default:
				return state;
		}
	});
}

export const getPosOrderState = createFeatureSelector<PosOrderState>('posOrder');

export const {
	selectAll,
} = adapter.getSelectors();
