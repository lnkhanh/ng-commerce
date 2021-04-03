import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseData, RequestParamModel } from '@app/core/models/common';
import { AdminHttpClient } from '@app/modules-services/admin/admin-api.service';
import { StoreTablePayload, StoreTableType, StoreType } from '@app/modules/e-commerce/_models/store.model';

@Injectable()
export class StoreService {
  private _storeUrl = '/stores';
  private _storeTableUrl = '/store-tables';

  constructor(private _adminApi: AdminHttpClient) { }

  fetchStoreList(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._adminApi.convertObjectToParamString(params);
    return this._adminApi.get<IResponseData>(`${this._storeUrl}${paramStr}`);
  }

	fetchAllStores(): Observable<IResponseData> {
		return this._adminApi.get<IResponseData>(`${this._storeUrl}/pos/all`);
	}

  fetchStoreById(storeId: string): Observable<IResponseData> {
    return this._adminApi.get<IResponseData>(`${this._storeUrl}/${storeId}`);
  }

  archiveStore(StoreId: string): Observable<IResponseData> {
    return this._adminApi.delete<IResponseData>(
      `${this._storeUrl}/${StoreId}`
    );
  }

  updateStore(store: StoreType): Observable<IResponseData> {
    return this._adminApi.put<IResponseData>(
      `${this._storeUrl}/${store.id}`,
      store
    );
  }

  createStore(store: StoreType): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(`${this._storeUrl}`, store);
  }

  // Store Table
  fetchStoreTableList(storeId: string, params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._adminApi.convertObjectToParamString(params);
    return this._adminApi.get<IResponseData>(`${this._storeTableUrl}/${storeId}${paramStr}`);
  }

  createStoreTable(storeTable: StoreTablePayload): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(`${this._storeTableUrl}`, storeTable);
  }

  removeStoreTable(tableId: string): Observable<IResponseData> {
    return this._adminApi.delete<IResponseData>(
      `${this._storeTableUrl}/${tableId}`
    );
  }

  updateStoreTable(tableId: string, name: string): Observable<IResponseData> {
    return this._adminApi.put<IResponseData>(
      `${this._storeTableUrl}/${tableId}`,
      { name }
    );
  }
}
