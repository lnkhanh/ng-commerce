import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseData, RequestParamModel } from '@app/core/models/common';
import { AdminHttpClient } from '@app/modules-services/admin/admin-api.service';
import { OrderType } from '@app/modules/e-commerce/_models/order.model';

@Injectable()
export class OrderService {
  private _orderUrl = '/orders';

  constructor(private _adminApi: AdminHttpClient) { }

  fetchOrderList(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._adminApi.convertObjectToParamString(params);
    return this._adminApi.get<IResponseData>(`${this._orderUrl}${paramStr}`);
  }

  fetchOrderById(orderId: string): Observable<IResponseData> {
    return this._adminApi.get<IResponseData>(`${this._orderUrl}/${orderId}`);
  }

  archiveOrder(orderId: string): Observable<IResponseData> {
    return this._adminApi.delete<IResponseData>(
      `${this._orderUrl}/${orderId}`
    );
  }

  updateOrder(order: OrderType): Observable<IResponseData> {
    return this._adminApi.put<IResponseData>(
      `${this._orderUrl}/${order.id}`,
      order
    );
  }

  createOrder(order: OrderType): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(`${this._orderUrl}`, order);
  }

  updateOrderStatus(orderId: string, newStatus: number) {
    return this._adminApi.put<IResponseData>(`${this._orderUrl}/order-status/${orderId}`, { status: newStatus });
  }
}
