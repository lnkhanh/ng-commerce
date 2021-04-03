import { createFeatureSelector, createSelector } from '@ngrx/store';
import { find } from 'lodash';

import { DashboardState } from '../_reducers/dashboard.reducers';
import { DashBoardActionTypes } from '../_actions/dashboard.actions';


export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectFilter = () => createSelector(
  selectDashboardState,
  state => {
    const { filter, pagination } = state;
    return {
      ...filter,
      pageSize: pagination.pageSize,
      pageIndex: pagination.pageIndex,
    }
  }
)

export const selectOrderRevenue = () => createSelector(
  selectDashboardState,
  state => state.orderRevenue
)

export const selectSaleActivity = () => createSelector(
  selectDashboardState,
  state => state.saleActivities
)

export const selectDashboardLoading = (loading: DashBoardActionTypes) => createSelector(
  selectDashboardState,
  state => !!find(state.loadingActions, item => item === loading)
);

export const selectDashboardFilter = createSelector(
  selectDashboardState,
  state => state.filter
);

export const selectOrderRevenueSummaryDashboard = createSelector(
  selectDashboardState,
  state => state.orderRevenueSummary
);

export const selectDashboardPagination = createSelector(
  selectDashboardState,
  state => state.pagination
);

export const selectOrderRevenueDetailDashboard = createSelector(
  selectDashboardState,
  state => state.orderRevenueDetail
);
