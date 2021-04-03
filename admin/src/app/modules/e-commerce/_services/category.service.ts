import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseData, RequestParamModel } from '@app/core/models/common';
import { AdminHttpClient } from '@app/modules-services/admin/admin-api.service';
import { CategoryType } from '@app/modules/e-commerce/_models/category.model';

@Injectable()
export class CategoryService {
  private _categoryUrl = '/categories';

  constructor(private _adminApi: AdminHttpClient) { }

  fetchCategoryList(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._adminApi.convertObjectToParamString(params);
    return this._adminApi.get<IResponseData>(`${this._categoryUrl}${paramStr}`);
  }

  fetchCategoryById(categoryId: string): Observable<IResponseData> {
    return this._adminApi.get<IResponseData>(`${this._categoryUrl}/${categoryId}`);
  }

  archiveCategory(categoryId: string): Observable<IResponseData> {
    return this._adminApi.delete<IResponseData>(
      `${this._categoryUrl}/${categoryId}`
    );
  }

  updateCategory(category: CategoryType): Observable<IResponseData> {
    return this._adminApi.put<IResponseData>(
      `${this._categoryUrl}/${category.id}`,
      category
    );
  }

  createCategory(category: CategoryType): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(`${this._categoryUrl}`, category);
  }
}
