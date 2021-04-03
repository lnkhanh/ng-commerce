import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseData, RequestParamModel } from '@app/core/models/common';
import { AdminHttpClient } from '@app/modules-services/admin/admin-api.service';
import { ProductType } from '@app/modules/e-commerce/_models/product.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ProductService {
  private _productUrl = '/products';

  constructor(private _adminApi: AdminHttpClient) { }

  fetchProductList(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._adminApi.convertObjectToParamString(params);
    return this._adminApi.get<IResponseData>(`${this._productUrl}${paramStr}`);
  }

  fetchProductById(productId: string): Observable<IResponseData> {
    return this._adminApi.get<IResponseData>(
      `${this._productUrl}/${productId}`
    );
  }

  archiveProduct(productId: string): Observable<IResponseData> {
    return this._adminApi.delete<IResponseData>(
      `${this._productUrl}/${productId}`
    );
  }

  updateProduct(product: ProductType): Observable<IResponseData> {
    console.log(product);
    return this._adminApi.put<IResponseData>(
      `${this._productUrl}/${product.id}`,
      product
    );
  }

  uploadProductPhotos(productId: string, body: FormData): Observable<IResponseData> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this._adminApi.post<IResponseData>(`${this._productUrl}/upload/photos/${productId}`, body, { headers });
  }

  createProduct(product: ProductType): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(`${this._productUrl}`, product);
  }
}
