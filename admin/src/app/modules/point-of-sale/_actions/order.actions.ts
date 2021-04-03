import { Action } from '@ngrx/store';
import { OrderType } from '@app/modules/e-commerce';
import { RequestParamModel, ResponseData } from '@app/core/models/common';
import { OrderDetails } from '../_models/pos.model';

export enum PosOrderActionTypes {
	FetchOrderList = '[POS ORDER] Fetch Order List',
	SaveOrderList = '[POS ORDER] Save Order List',
	SaveOrderRequestParams = '[ORDER] Save Order Request Params',

	FetchOrderDetails = '[POS ORDER] Fetch Order Details',
	UpdateOrder = '[POS ORDER] Update Order',
	SaveOrderDetails = '[POS ORDER] Save Order Details',

	RemoveOrder = '[POS ORDER] Remove Order',
	RemoveOrderSuccess = '[POS ORDER] Remove Order Success',

	UpdateOrderItemQuantity = '[POS ORDER] Update Order Item Quantity',
	UpdateOrderItemQuantitySuccess = '[POS ORDER] Update Order Item Quantity',
	RemoveOrderItem = '[POS ORDER] Remove Order Item',

	ChangeOrderStatus = '[POS ORDER] Change Order Status',
	ChangeOrderStatusSuccess = '[POS ORDER] Change Order Status Success'
}

export class FetchOrderListAction implements Action {
	readonly type = PosOrderActionTypes.FetchOrderList;

	constructor() { }
}

export class SaveOrderListAction implements Action {
	readonly type = PosOrderActionTypes.SaveOrderList;

	constructor(public payload: { response: ResponseData }) { }
}

export class SaveRequestParamsAction implements Action {
	readonly type = PosOrderActionTypes.SaveOrderRequestParams;
	constructor(public payload: { params: RequestParamModel }) { }
}

export class FetchOrderDetailsAction implements Action {
	readonly type = PosOrderActionTypes.FetchOrderDetails;

	constructor(public payload: { orderId: string }) { }
}

export class SaveOrderDetailsAction implements Action {
	readonly type = PosOrderActionTypes.SaveOrderDetails;

	constructor(public payload: { order: OrderDetails }) { }
}

export class UpdateOrderAction implements Action {
	readonly type = PosOrderActionTypes.UpdateOrder;

	constructor(public payload: { data: any }) { } // TODO
}

export class RemoveOrderAction implements Action {
	readonly type = PosOrderActionTypes.RemoveOrder;

	constructor(public payload: { orderId: string }) { }
}

export class RemoveOrderSuccessAction implements Action {
	readonly type = PosOrderActionTypes.RemoveOrderSuccess;

	constructor() { }
}

export class ChangeOrderStatusAction implements Action {
	readonly type = PosOrderActionTypes.ChangeOrderStatus;

	constructor(public payload: { orderId: string, status: number, reloadList?: boolean, reloadDetail?: boolean }) { }
}

export class ChangeOrderStatusSuccessAction implements Action {
	readonly type = PosOrderActionTypes.ChangeOrderStatusSuccess;

	constructor() { }
}

export class UpdateOrderItemQuantityAction implements Action {
	readonly type = PosOrderActionTypes.UpdateOrderItemQuantity;

	constructor(public payload: { orderId: string, itemId: string, quantity: number, note: string }) { }
}

export class UpdateOrderItemQuantitySuccessAction implements Action {
	readonly type = PosOrderActionTypes.UpdateOrderItemQuantitySuccess;

	constructor() { }
}

export class RemoveOrderItemAction implements Action {
	readonly type = PosOrderActionTypes.RemoveOrderItem;

	constructor(public payload: { orderId: string, itemId: string }) { }
}

export type PosOrderActions =
	| FetchOrderListAction
	| SaveOrderListAction
	| SaveRequestParamsAction
	| FetchOrderDetailsAction
	| SaveOrderDetailsAction
	| UpdateOrderAction
	| RemoveOrderAction
	| RemoveOrderSuccessAction
	| ChangeOrderStatusAction
	| ChangeOrderStatusSuccessAction
	| UpdateOrderItemQuantityAction
	| UpdateOrderItemQuantitySuccessAction
	| RemoveOrderItemAction;
