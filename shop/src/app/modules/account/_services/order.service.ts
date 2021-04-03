import { Injectable } from '@angular/core';
import { IResponseData, RequestParamModel } from '@app/shared/models/common';
import { NgCommerceHttpClient } from '@app/modules-services/ng-commerce/ng-commerce-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderService {
  private _orderUrl = '/orders';

  constructor(private _api: NgCommerceHttpClient) { }

  fetchOrders(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._api.convertObjectToParamString(params);
    return this._api.get<IResponseData>(`${this._orderUrl}${paramStr}`).pipe(
      map((rs) => {
        // Mapping for legacy properties
        if (rs) {
          rs.data.pageSize = rs.data.itemPerPage;
          rs.data.pageIndex = rs.data.page;
        }

        return rs;
      })
    );
  }

  fetchOrderDetails(orderId: string): Observable<IResponseData> {
    return this._api.get<IResponseData>(`${this._orderUrl}/${orderId}`);
  }
}