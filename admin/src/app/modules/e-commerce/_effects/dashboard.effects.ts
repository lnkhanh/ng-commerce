import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { switchMap, mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { AppState } from '@core/reducers';
import { AddLoadingAction, RemoveLoadingAction } from '@core/actions/loading.actions';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';

import * as DashboardSelector from '../_selectors/dashboard.selectors';
import { DashBoardService } from '../_services/dashboard.service';
import {
  DashBoardActionTypes,
  GetOrderRevenueSummaryDashboardAction,
  SaveOrderRevenueSummaryDashboardAction,
  ToggleLoadingDashboardAction,
  FetchOrderRevenueAction,
  SaveOrderRevenueAction,
  SaveSaleActivityAction,
  FetchSaleActivityAction,
  GetOrderRevenueDetailDashboardAction,
  // SaveOrderRevenueDetailDashboardAction,
} from '../_actions/dashboard.actions';
import {
  OrderRevenueSummaryModel,
  OrderRevenueParams,
  SaleActivityParams,
  OrderRevenueDetailResultModel,
  OrderRevenueData,
} from '../_models/dashboard.model';
import { selectFilter } from '../_selectors/dashboard.selectors';
import * as moment from 'moment';
import { forkJoin, of } from 'rxjs';
import { orderBy } from 'lodash';
import { IResponseData } from '@app/core/models/common';


@Injectable()
export class DashboardEffects {
  constructor(
    private _actions$: Actions,
    private _store: Store<AppState>,
    private _toastService: ToastService,
    private _dashboardService: DashBoardService,
  ) { }

  @Effect()
  getOrderRevenueSummary$ = this._actions$.pipe(
    ofType<GetOrderRevenueSummaryDashboardAction>(DashBoardActionTypes.GET_ORDER_REVENUE_SUMMARY),
    withLatestFrom(this._store.pipe(select(DashboardSelector.selectDashboardFilter))),
    mergeMap(([action, filter]) => {
      this._store.dispatch(new ToggleLoadingDashboardAction(action.type));
      return forkJoin(of(filter), this._dashboardService.getOrderRevenueSummary(filter));
    }),
    map(([filter, response]) => {
      const { fromDate, toDate } = filter;
      const dateRange = this._generateTimeRange(fromDate, toDate);

      const result = this._fixMissingDateOfOrderRevenueSummary(dateRange, response);

      this._store.dispatch(new ToggleLoadingDashboardAction(DashBoardActionTypes.GET_ORDER_REVENUE_SUMMARY));
      return new SaveOrderRevenueSummaryDashboardAction(result);
    }),
    catchError((error, caught) => {
      this._toastService.showDanger(error && error.error ? error.error.Message : 'Something went wrong, please try again!');
      this._store.dispatch(new ToggleLoadingDashboardAction(DashBoardActionTypes.GET_ORDER_REVENUE_SUMMARY));
      return caught;
    })
  );

  @Effect()
  fetchOrderRevenue = this._actions$
    .pipe(
      ofType<FetchOrderRevenueAction>(DashBoardActionTypes.FETCH_ORDER_REVENUE),
      withLatestFrom(this._store.pipe(select(selectFilter()))),
      mergeMap(([action, filter]) => {
        const { storeId, fromDate, toDate } = filter;
        const params = new OrderRevenueParams({
          storeId,
          end: toDate,
          start: fromDate,
        });
        this._store.dispatch(new AddLoadingAction({ currentAction: DashBoardActionTypes.FETCH_ORDER_REVENUE }));
        return forkJoin([of(filter), this._dashboardService.fetchOrderRevenue(params)]);
      }),
      map(([filter, response]) => {
        if (!response.data || !response.data.Data) {
          throw new Error();
        }

        const { fromDate, toDate } = filter;
        const dateRange = this._generateTimeRange(fromDate, toDate);

        const result = {
          ...response.data,
          Data: this._fixMissingDateOfOrderRevenue(dateRange, response.data.Data)
        }

        this._store.dispatch(new RemoveLoadingAction({ currentAction: DashBoardActionTypes.FETCH_ORDER_REVENUE }));
        return new SaveOrderRevenueAction(result);
      }),
      catchError((error, caught) => {
        this._toastService.showDanger(error && error.error && error.error.Message ? error.error.Message : 'Something went wrong, please try again!');
        this._store.dispatch(new RemoveLoadingAction({ currentAction: DashBoardActionTypes.FETCH_ORDER_REVENUE }));
        return caught;
      })
    );

  @Effect()
  fetchSaleActivity = this._actions$
    .pipe(
      ofType<FetchSaleActivityAction>(DashBoardActionTypes.FETCH_SALE_ACTIVITY),
      withLatestFrom(this._store.pipe(select(selectFilter()))),
      mergeMap(([action, filter]) => {
        const { storeId, fromDate, toDate, pageSize } = filter;
        const params = new SaleActivityParams({
          storeId,
          pageSize,
          start: fromDate,
          end: toDate,
        });
        this._store.dispatch(new AddLoadingAction({ currentAction: DashBoardActionTypes.FETCH_SALE_ACTIVITY }));
        return this._dashboardService.fetchSaleActivity(params);
      }),
      map(response => {
        this._store.dispatch(new RemoveLoadingAction({ currentAction: DashBoardActionTypes.FETCH_SALE_ACTIVITY }));
        return new SaveSaleActivityAction(response.data);
      }),
      catchError((error, caught) => {
        this._toastService.showDanger(error && error.error && error.error.Message ? error.error.Message : 'Something went wrong, please try again!');
        this._store.dispatch(new RemoveLoadingAction({ currentAction: DashBoardActionTypes.FETCH_SALE_ACTIVITY }));
        return caught;
      })
    );

  // @Effect()
  // getOrderRevenueDetail$ = this._actions$.pipe(
  //   ofType<GetOrderRevenueDetailDashboardAction>(DashBoardActionTypes.GET_ORDER_REVENUE_DETAIL),
  //   withLatestFrom(
  //     this._store.pipe(select(DashboardSelector.selectDashboardFilter)),
  //     this._store.pipe(select(DashboardSelector.selectDashboardPagination))
  //   ),
  //   switchMap(([action, filter, pagination]) => {
  //     this._store.dispatch(new ToggleLoadingDashboardAction(action.type));
  //     return this._dashboardService.getOrderRevenueDetail(filter, pagination);
  //   }),
  //   map((response: IResponseData) => {
  //     this._store.dispatch(new ToggleLoadingDashboardAction(DashBoardActionTypes.GET_ORDER_REVENUE_DETAIL));
  //     return new SaveOrderRevenueDetailDashboardAction(response.data);
  //   }),
  //   catchError((error, caught) => {
  //     this._toastService.showDanger(error && error.error ? error.error.Message : 'Something went wrong, please try again!');
  //     this._store.dispatch(new ToggleLoadingDashboardAction(DashBoardActionTypes.GET_ORDER_REVENUE_DETAIL));
  //     return caught;
  //   })
  // );

  private _generateTimeRange(dateStart: string, dateEnd: string): string[] {
    const result = new Set<string>();

    const begin = moment(dateStart)
      .hour(0)
      .minute(0)
      .second(0)
      ;
    const end = moment(dateEnd)
      .hour(0)
      .minute(0)
      .second(0)
      ;
    result.add(begin.format());

    for (let index = 0; index < 30; index++) {
      const day = begin.add(1, 'days');
      if (!day.isSame(end, 'day') && day.isBefore(end, 'day')) {
        result.add(day.format());
      }
    }

    result.add(end.format());

    return [...result];
  }
  private _fixMissingDateOfOrderRevenue(dateRange: string[], data: OrderRevenueData[]): OrderRevenueData[] {
    if (data && data.length > 0) {
      const dataDate = data.map(o => moment(o.OrderDate).format());
      let result = [...data];

      dateRange
        .forEach(date => {
          if (dataDate.indexOf(date) === -1) {
            result.push({
              OrderDate: date,
              TotalAmount: 0,
              TotalOrder: 0
            })
          }
        });

      return orderBy(result, 't', 'asc');
    } else {
      return data;
    }
  }
  private _fixMissingDateOfOrderRevenueSummary(dateRange: string[], data: OrderRevenueSummaryModel[]): OrderRevenueSummaryModel[] {
    if (data && data.length > 0) {
      const dataDate = data.map(o => moment(o.OrderDate, 'YYYY-MM-DD').format());
      let result = [...data];

      dateRange.forEach(date => {
        if (dataDate.indexOf(date) === -1) {
          const item = new OrderRevenueSummaryModel();
          item.OrderDate = moment(date).format('YYYY-MM-DD');
          item.Orders = [];
          item.Revenues = [];
          item.ShippingCosts = [];
          item.Status = [];
          item.Taxes = [];
          item.TotalOrder = 0;
          item.TotalRevenue = 0;
          item.TotalShippingCost = 0;
          item.TotalTax = 0;

          result.push(item);
        }
      })

      return orderBy(result, 'OrderDate', 'asc');
    } else {
      return data;
    }
  }

}
