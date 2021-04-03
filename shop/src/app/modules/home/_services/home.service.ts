import { Injectable } from '@angular/core';
import { IResponseData, RequestParamModel } from '@app/shared/models/common';
import { NgCommerceHttpClient } from '@app/modules-services/ng-commerce/ng-commerce-api.service';
import { Observable } from 'rxjs';
import { AddCartItemData, CheckoutData, CheckoutResult } from '../_models/cart.model';
import { map } from 'rxjs/operators';

@Injectable()
export class HomeService {
  private _categoryUrl = '/categories';
  private _productUrl = '/products';
  private _orderUrl = '/orders';
  private _cartUrl = '/cart-items';
  private _checkoutUrl = '/checkout';
  private _wishListUrl = '/account/wishlist';

  constructor(private _api: NgCommerceHttpClient) { }

  fetchCategories(): Observable<IResponseData> {
    return this._api.get<IResponseData>(`${this._categoryUrl}`);
  }

  fetchCart() {
    return this._api.get<IResponseData>(`${this._cartUrl}`);
  }

  addCartItem(data: AddCartItemData): Observable<IResponseData> {
    return this._api.post<IResponseData>(`${this._cartUrl}`, data);
  }

  removeCartItem(itemId: string): Observable<IResponseData> {
    return this._api.delete<IResponseData>(`${this._cartUrl}/${itemId}`);
  }

  updateCartItem(itemId: string, quantity: number, note: string): Observable<IResponseData> {
    return this._api.put<IResponseData>(`${this._cartUrl}/${itemId}`, { quantity, note });
  }

  checkout(data: CheckoutData) {
    return this._api.post<IResponseData & { data: CheckoutResult }>(`${this._checkoutUrl}`, data);
  }

  searchProducts(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._api.convertObjectToParamString(params);
    return this._api.get<IResponseData>(`${this._productUrl}${paramStr}`).pipe(
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

  fetchProductDetails(productId: string): Observable<IResponseData> {
    return this._api.get<IResponseData>(`${this._productUrl}/${productId}`);
  }

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

  // WishList
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