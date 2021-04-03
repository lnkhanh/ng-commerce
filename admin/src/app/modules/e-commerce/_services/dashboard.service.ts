import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { set, pickBy } from 'lodash';

import { AdminHttpClient } from '@app/modules-services';
import {
  DashBoardFilterModel,
  OrderRevenueSummaryModel,
  OrderRevenueDetailResultModel,
  OrderRevenueParams,
  OrderRevenueResponse,
  SaleActivityParams,
  SaleActivityResponse,
} from '../_models/dashboard.model';
import { TypesUtilsService } from '@app/core/views/crud';
import { IResponseData } from '@app/core/models/common';

@Injectable()
export class DashBoardService {

  private _reportUrl = '/report';


  constructor(
    private _adminApi: AdminHttpClient,
    private _typesService: TypesUtilsService
  ) { }

  private convertFilterToObject(filter: DashBoardFilterModel): Object {
    const query: any = {};
    if (filter.storeId) {
      set(query, 'storeId', filter.storeId);
    }
    set(query, 'start', this._typesService.convertParamDate(filter.fromDate));
    set(query, 'end', this._typesService.convertParamDate(filter.toDate));

    return query;
  }

  getOrderRevenueSummary(filter: DashBoardFilterModel): Observable<OrderRevenueSummaryModel[]> {
    const companyId = 0;// TODO
    const query: any = this.convertFilterToObject(filter);

    const queryString = this._adminApi.convertObjectToParamString(query);
    return this._adminApi.get<OrderRevenueSummaryModel[]>(
      `${this._reportUrl}/${companyId}/order-revenue-detail-summary${queryString}`
    );
  }

  getOrderRevenueDetail(filter: DashBoardFilterModel, paging: any): Observable<OrderRevenueDetailResultModel> {
    const companyId = 0; // TODO
    const query: any = this.convertFilterToObject(filter);
    set(query, 'pageSize', paging.pageSize || 10);
    set(query, 'pageIndex', paging.pageIndex + 1 || 1);

    const queryString = this._adminApi.convertObjectToParamString(query);

    return this._adminApi.get<OrderRevenueDetailResultModel>(
      `${this._reportUrl}/${companyId}/order-revenue-detail${queryString}`
    );
  }

  fetchOrderRevenue(params: OrderRevenueParams): Observable<IResponseData> {
    params.start = this._typesService.convertParamDate(params.start);
    params.end = this._typesService.convertParamDate(params.end);
    const paramString = this._adminApi.convertObjectToParamString(pickBy(params));
    const endpoint = `${this._reportUrl}/order/revenue${paramString}`;
    return this._adminApi.get<IResponseData>(endpoint);
  }

  fetchSaleActivity(params: SaleActivityParams): Observable<IResponseData> {
    params.start = this._typesService.convertParamDate(params.start);
    params.end = this._typesService.convertParamDate(params.end);
    const paramString = this._adminApi.convertObjectToParamString(pickBy(params));
    const endpoint = `${this._reportUrl}/order/top-sales${paramString}`;
    return this._adminApi.get<IResponseData>(endpoint);
  }
}
