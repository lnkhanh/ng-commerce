import { RequestParamModel, ResponseData } from '@app/shared/models/common';
import { Action } from '@ngrx/store';
import { OrderType } from '../../home/_models/order.model';

export enum OrderActionTypes {
	FetchOrders = '[ORDER] Fetch Order History',
	SaveOrders = '[ORDER] Save Order History',
	SaveOrderCriteria = '[ORDER] Save Order Criteria',

	FetchOrderDetails = '[ORDER] Fetch Order Details',
	SaveOrderDetails = '[ORDER] Save Order Details'
}

export class FetchOrderHistoryAction implements Action {
	readonly type = OrderActionTypes.FetchOrders;

	constructor() { }
}

export class SaveOrderHistoryAction implements Action {
	readonly type = OrderActionTypes.SaveOrders;

	constructor(public response: ResponseData) { }
}

export class SaveOrderCriteriaAction implements Action {
	readonly type = OrderActionTypes.SaveOrderCriteria;

	constructor(public criteria: RequestParamModel) { }
}

export class FetchOrderDetailsAction implements Action {
	readonly type = OrderActionTypes.FetchOrderDetails;

	constructor(public orderCode: string) { }
}

export class SaveOrderDetailsAction implements Action {
	readonly type = OrderActionTypes.SaveOrderDetails;

	constructor(public order: OrderType) { }
}

export type OrderActions = FetchOrderHistoryAction | SaveOrderHistoryAction | SaveOrderCriteriaAction | FetchOrderDetailsAction | SaveOrderDetailsAction;
