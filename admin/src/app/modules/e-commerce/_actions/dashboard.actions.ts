import { IResponseData } from '@app/core/models/common';
import { Action } from '@ngrx/store';
// import { PaginatorModel } from '@app/core-ui/_base/crud/models/_base.model';
import {
  DashBoardFilterModel,
  OrderRevenueSummaryModel,
  SaleActivityResponse, OrderRevenueResponse,
  OrderRevenueDetailResultModel,
  SaleData,
} from '../_models/dashboard.model';

export enum DashBoardActionTypes {
  DASHBOARD_LOADING = "[DASHBOARD] Loading",

  SAVE_FILTER = "[DASHBOARD] Save Filter",
  SAVE_PAGINATION = '[DASHBOARD] Save Pagination',

  GET_ORDER_REVENUE_SUMMARY = "[DASHBOARD] Get Order Revenue Summary",
  SAVE_ORDER_REVENUE_SUMMARY = "[DASHBOARD] Save Order Revenue Summary",

  FETCH_ORDER_REVENUE = "[DASHBOARD] Fetch order revenue",
  SAVE_ORDER_REVENUE = "[DASHBOARD] Save order revenue",

  FETCH_SALE_ACTIVITY = "[DASHBOARD] Fetch sale activity",
  SAVE_SALE_ACTIVITY = "[DASHBOARD] Save sale activity",

  GET_ORDER_REVENUE_DETAIL = '[DASHBOARD] Get Order Revenue Detail',
  SAVE_ORDER_REVENUE_DETAIL = '[DASHBOARD] Save Order Revenue Detail',
}

export class FetchOrderRevenueAction implements Action {
  readonly type = DashBoardActionTypes.FETCH_ORDER_REVENUE;
  constructor() {}
}

export class SaveOrderRevenueAction implements Action {
  readonly type = DashBoardActionTypes.SAVE_ORDER_REVENUE;
  constructor(public payload: OrderRevenueResponse) {}
}

export class FetchSaleActivityAction implements Action {
  readonly type = DashBoardActionTypes.FETCH_SALE_ACTIVITY;
  constructor() {}
}

export class SaveSaleActivityAction implements Action {
  readonly type = DashBoardActionTypes.SAVE_SALE_ACTIVITY;
  constructor(public payload: SaleData[]) {}
}

export class ToggleLoadingDashboardAction implements Action {
  readonly type = DashBoardActionTypes.DASHBOARD_LOADING;
  constructor(public payload: string) {}
}
export class SaveFilterDashboardAction implements Action {
  readonly type = DashBoardActionTypes.SAVE_FILTER;
  constructor(public payload: DashBoardFilterModel) {}
}
export class SavePaginationDashboardAction implements Action {
  readonly type = DashBoardActionTypes.SAVE_PAGINATION;
  constructor(public payload: any) {}
}

export class GetOrderRevenueSummaryDashboardAction implements Action {
  readonly type = DashBoardActionTypes.GET_ORDER_REVENUE_SUMMARY;
  constructor(public payload: any) {}
}
export class SaveOrderRevenueSummaryDashboardAction implements Action {
  readonly type = DashBoardActionTypes.SAVE_ORDER_REVENUE_SUMMARY;
  constructor(public payload: OrderRevenueSummaryModel[]) {}
}

export class GetOrderRevenueDetailDashboardAction implements Action {
  readonly type = DashBoardActionTypes.GET_ORDER_REVENUE_DETAIL;
  constructor(public payload: any) {}
}
// export class SaveOrderRevenueDetailDashboardAction implements Action {
//   readonly type = DashBoardActionTypes.SAVE_ORDER_REVENUE_DETAIL;
//   constructor(public payload: OrderRevenueResponse) {}
// }

export type DashboardActions =
  ToggleLoadingDashboardAction |
  GetOrderRevenueSummaryDashboardAction |
  SaveOrderRevenueSummaryDashboardAction |
  FetchOrderRevenueAction |
  FetchSaleActivityAction |
  SaveOrderRevenueAction |
  SaveSaleActivityAction |
  SaveFilterDashboardAction |
  SavePaginationDashboardAction |
  GetOrderRevenueDetailDashboardAction 
  // SaveOrderRevenueDetailDashboardAction
;
