import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseData } from '@app/core/models/common';
import { AdminHttpClient } from '@app/modules-services/admin/admin-api.service';
import { AddCartItemData, CheckoutData } from '../_models/pos.model';

@Injectable()
export class PosService {
	private _productUrl = '/products';
	private _storeUrl = '/stores';
	private _storeTableUrl = '/store-tables';
	private _categoryUrl = '/categories';
	private _cartUrl = '/cart-items';
	private _checkoutUrl = '/checkout';

	constructor(private _adminApi: AdminHttpClient) { }

	fetchAllProduct(): Observable<IResponseData> {
		return this._adminApi.get<IResponseData>(`${this._productUrl}/pos/all`);
	}

	fetchAllCategories(): Observable<IResponseData> {
		return this._adminApi.get<IResponseData>(`${this._categoryUrl}/pos/all`);
	}

	fetchAllStores(): Observable<IResponseData> {
		return this._adminApi.get<IResponseData>(`${this._storeUrl}/pos/all`);
	}

	fetchTablesByStoreId(storeId: string): Observable<IResponseData> {
		return this._adminApi.get<IResponseData>(`${this._storeTableUrl}/pos/${storeId}`);
	}

	fetchCart(): Observable<IResponseData> {
		return this._adminApi.get<IResponseData>(`${this._cartUrl}`);
	}

	addCartItem(data: AddCartItemData): Observable<IResponseData> {
		return this._adminApi.post<IResponseData>(`${this._cartUrl}`, data);
	}

	removeCartItem(itemId: string): Observable<IResponseData> {
		return this._adminApi.delete<IResponseData>(`${this._cartUrl}/${itemId}`);
	}

	updateCartItem(itemId: string, quantity: number, note: string): Observable<IResponseData> {
		return this._adminApi.put<IResponseData>(`${this._cartUrl}/${itemId}`, { quantity, note });
	}

	checkout(data: CheckoutData) {
		return this._adminApi.post<IResponseData>(`${this._checkoutUrl}`, data);
	}
}
