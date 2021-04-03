import { Action } from '@ngrx/store';
import { RequestParamModel, ResponseData } from '@app/core/models/common';
import { OrderType } from '@app/modules/e-commerce/_models/order.model';

export enum OrderActionTypes {
  FetchOrderList = '[ORDER] Fetch Order List',
  SaveList = '[ORDER] Save Order List',

  SaveRequestParams = '[ORDER] Save Request Params',

  CreateOrder = '[ORDER] Create Order',
  CreateOrderSuccess = '[ORDER] Create Order Success',

  FetchOrderDetails = '[ORDER] Fetch Order Details',
  UpdateOrder = '[ORDER] Update Order',
  SaveOrderDetails = '[ORDER] Save Order Details',

  UpdateOrderStatus = '[ORDER] Update Order Status',
  UpdateOrderStatusSuccess = '[ORDER] Update Order Status Success',

  ArchiveOrder = '[ORDER] Archive Order',
  ArchiveOrderSuccess = '[ORDER] Archive Order Success',
}

export class FetchOrderListAction implements Action {
  readonly type = OrderActionTypes.FetchOrderList;

  constructor() {}
}

export class SaveListAction implements Action {
  readonly type = OrderActionTypes.SaveList;

  constructor(public payload: { response: ResponseData }) {}
}

export class SaveRequestParamsAction implements Action {
  readonly type = OrderActionTypes.SaveRequestParams;
  constructor(public payload: { params: RequestParamModel }) {}
}

export class CreateOrderAction implements Action {
  readonly type = OrderActionTypes.CreateOrder;
  constructor(public payload: { data: OrderType }) {}
}

export class CreateOrderSuccessAction implements Action {
  readonly type = OrderActionTypes.CreateOrderSuccess;
  constructor(public payload: { order: OrderType }) {}
}

export class FetchOrderDetailsAction implements Action {
  readonly type = OrderActionTypes.FetchOrderDetails;
  constructor(public payload: { orderId: string }) {}
}

export class UpdateOrderAction implements Action {
  readonly type = OrderActionTypes.UpdateOrder;
  constructor(public payload: { data: OrderType }) {}
}

export class UpdateOrderStatusAction implements Action {
  readonly type = OrderActionTypes.UpdateOrderStatus;

  constructor(public payload: { orderId: string; status: number; }) {}
}

export class UpdateOrderStatusSuccessAction implements Action {
  readonly type = OrderActionTypes.UpdateOrderStatusSuccess;

  constructor() {}
}

export class SaveCurrentOrderAction implements Action {
  readonly type = OrderActionTypes.SaveOrderDetails;
  constructor(public payload: { order: OrderType }) {}
}

export class ArchiveOrderAction implements Action {
  readonly type = OrderActionTypes.ArchiveOrder;
  constructor(public payload: { orderId: string }) {}
}

export class ArchiveOrderSuccessAction implements Action {
  readonly type = OrderActionTypes.ArchiveOrderSuccess;
  constructor(public payload: { isSuccess: boolean }) {}
}

export type OrderActions =
  | FetchOrderListAction
  | SaveListAction
  | SaveRequestParamsAction
  | CreateOrderAction
  | CreateOrderSuccessAction
  | FetchOrderDetailsAction
  | UpdateOrderAction
  | UpdateOrderStatusAction
  | UpdateOrderStatusSuccessAction
  | SaveCurrentOrderAction
  | ArchiveOrderAction
  | ArchiveOrderSuccessAction;
