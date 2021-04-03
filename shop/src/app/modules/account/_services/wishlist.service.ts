import { Injectable } from '@angular/core';
import { IResponseData, RequestParamModel } from '@app/shared/models/common';
import { NgCommerceHttpClient } from '@app/modules-services/ng-commerce/ng-commerce-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WishListService {
  private _wishListUrl = '/account/wishlist';

  constructor(private _api: NgCommerceHttpClient) { }

  fetchWishList(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._api.convertObjectToParamString(params);
    return this._api.get<IResponseData>(`${this._wishListUrl}${paramStr}`).pipe(
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

  addWishList(productId: string): Observable<IResponseData> {
    return this._api.post<IResponseData>(`${this._wishListUrl}`, { productId });
  }

  removeWishList(id: string): Observable<IResponseData> {
    return this._api.delete<IResponseData>(`${this._wishListUrl}/${id}`);
  }

  checkAdded(productId: string): Observable<IResponseData> {
    return this._api.get<IResponseData>(`${this._wishListUrl}/${productId}`);
  }
}