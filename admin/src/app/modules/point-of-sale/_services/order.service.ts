import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseData, RequestParamModel } from '@app/core/models/common';
import { AdminHttpClient } from '@app/modules-services/admin/admin-api.service';

@Injectable()
export class PosOrderService {
	private _orderUrl = '/orders';

	constructor(private _adminApi: AdminHttpClient) { }

	fetchOrders(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._adminApi.convertObjectToParamString(params);
		  return this._adminApi.get<IResponseData>(`${this._orderUrl}/pos/in-day${paramStr}`);
	}

	fetchOrderDetails(orderId: string): Observable<IResponseData> {
		return this._adminApi.get<IResponseData>(`${this._orderUrl}/${orderId}`);
	}

	updateOrder(data: any): Observable<IResponseData> { // TODO
		return this._adminApi.put<IResponseData>(`${this._orderUrl}/pos`, data);
	}

	changeOrderStatus(orderId: string, status: number): Observable<IResponseData> {
		return this._adminApi.put<IResponseData>(`${this._orderUrl}/order-status/${orderId}`, { status });
	}

	removeOrder(orderId: string): Observable<IResponseData> {
		return this._adminApi.delete<IResponseData>(`${this._orderUrl}/${orderId}`);
	}

	removeOrderItem(orderId: string, itemId: string): Observable<IResponseData> {
		return this._adminApi.delete<IResponseData>(`${this._orderUrl}/${orderId}/${itemId}`);
	}

	updateOrderItem(orderId: string, itemId: string, quantity: number, note: string): Observable<IResponseData> {
		return this._adminApi.put<IResponseData>(`${this._orderUrl}/${orderId}/${itemId}`, { quantity, note });
	}
}
