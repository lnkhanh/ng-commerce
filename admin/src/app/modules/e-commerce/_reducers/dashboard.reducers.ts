import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import produce from 'immer';
import { find, orderBy } from 'lodash';
import { environment } from '@env/environment';

import {
  DashboardActions,
  DashBoardActionTypes
} from '../_actions/dashboard.actions';
import {
  DashBoardFilterModel,
  OrderRevenueSummaryModel,
  OrderRevenueDetailModel,
  OrderRevenueData,
  SaleData,
 } from '../_models/dashboard.model';

export interface DashboardState {
  loadingActions: string[];
  filter: DashBoardFilterModel;
  orderRevenueSummary: OrderRevenueSummaryModel[];
  orderRevenue: {
    Data: OrderRevenueData[];
    Sale: any[],
    Order: any[],
    Revenue: number;
    TotalOrder: number;
    TotalShippingCost: number;
    TotalTax: number;
    start: string;
    End: string;
  };
  orderRevenueDetail: OrderRevenueDetailModel[];
  pagination: {
    totalPage: number;
    totalRecord: number;
    pageSize: number;
    pageIndex: number;
  };
  saleActivities: {
    Sales: SaleData[];
    // PageSize: number;
    // PageIndex: number;
    // TotalPages: number;
    // TotalRecords: number;
    SaleChartData: any[],
  },
};

export const adapter: EntityAdapter<DashboardState> = createEntityAdapter<DashboardState>();

const initialDashboardState: DashboardState = produce(adapter.getInitialState({
  loadingActions: [],
  filter: {
    companyId: "0", //environment.defaultCompanyId,
    storeId: null,
    fromDate: null,
    toDate: null,
    serviceId: null,
  },
  orderRevenueSummary: [],
  orderRevenue: null,
  orderRevenueDetail: [],
  pagination: {
    totalPage: 0,
    totalRecord: 0,
    pageSize: 10,
    pageIndex: 0,
  },
  saleActivities: null,
}), draft => draft);

export function dashboardReducer(
  state = initialDashboardState,
  action: DashboardActions
): DashboardState {
  return produce(state, draft => {
    switch (action.type) {
      case DashBoardActionTypes.SAVE_FILTER:
        draft.pagination.pageIndex = 0;
        draft.filter = action.payload;
        break;
      case DashBoardActionTypes.SAVE_PAGINATION:
        const { pageSize } = action.payload
        draft.pagination.pageSize = pageSize;
        break;
      case DashBoardActionTypes.GET_ORDER_REVENUE_SUMMARY:
        draft.orderRevenueSummary = [];
        break;
      case DashBoardActionTypes.SAVE_ORDER_REVENUE_SUMMARY:
        draft.orderRevenueSummary = action.payload;
        break;
      case DashBoardActionTypes.SAVE_ORDER_REVENUE:
        const sortedData = orderBy(action.payload.Data, ['OrderDate'], ['asc']);
        const saleRevenueChartData = sortedData.map(item => {
          return { ...item, y: item.TotalAmount, t: item.OrderDate };
        });
        const orderRevenueChartData = sortedData.map(item => {
          return { ...item, y: item.TotalOrder, t: item.OrderDate };
        });

        draft.orderRevenue = {
          ...draft.orderRevenue,
          ...action.payload,
          Sale: saleRevenueChartData,
          Order: orderRevenueChartData
        };
        break;
      case DashBoardActionTypes.GET_ORDER_REVENUE_DETAIL:
        draft.orderRevenueDetail = [];
        break;
      // case DashBoardActionTypes.SAVE_ORDER_REVENUE_DETAIL:
      //   draft.orderRevenueDetail = action.payload.OrderRevenues;
      //   // draft.pagination.pageSize = action.payload.PageSize;
      //   // draft.pagination.pageIndex = action.payload.PageIndex;
      //   draft.pagination.totalRecord = action.payload.TotalRecords;
      //   draft.pagination.totalPage = action.payload.TotalPages;
      //   break;
      case DashBoardActionTypes.SAVE_SALE_ACTIVITY:
        draft.saleActivities = {
          ...draft.saleActivities,
          Sales: action.payload,
          SaleChartData: action.payload.map(i => { return {...i, y: i.Revenue}}),
        };
        break;
      case DashBoardActionTypes.DASHBOARD_LOADING:
        const currentAction = action.payload;
        let loadingActions = [...state.loadingActions];
        const found = find(state.loadingActions, item => item === currentAction);
        if (found) {
          loadingActions = loadingActions.filter(item => item !== currentAction);
        } else {
          if (!loadingActions.length) {
            loadingActions = [currentAction];
          } else {
            loadingActions.push(currentAction);
          }
        }

        draft.loadingActions = loadingActions;
        break;

      default: break;
    }
  })
}
