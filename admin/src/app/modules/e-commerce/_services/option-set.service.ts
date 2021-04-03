import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseData, RequestParamModel } from '@app/core/models/common';
import { AdminHttpClient } from '@app/modules-services/admin/admin-api.service';
import { OptionSet } from '@app/modules/e-commerce/_models/option-set.model';

@Injectable()
export class OptionSetService {
  private _optionSetUrl = '/option-set';

  constructor(private _adminApi: AdminHttpClient) { }

  fetchOptionSets(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._adminApi.convertObjectToParamString(params);
    return this._adminApi.get<IResponseData>(`${this._optionSetUrl}${paramStr}`);
  }

  fetchOptionSetById(optionSetId: string): Observable<IResponseData> {
    return this._adminApi.get<IResponseData>(`${this._optionSetUrl}/${optionSetId}`);
  }

  removeOptionSet(optionSetId: string): Observable<IResponseData> {
    return this._adminApi.delete<IResponseData>(
      `${this._optionSetUrl}/${optionSetId}`
    );
  }

  updateOptionSet(payload: OptionSet): Observable<IResponseData> {
    return this._adminApi.put<IResponseData>(
      `${this._optionSetUrl}/${payload.id}`,
      payload
    );
  }

  createOptionSet(payload: OptionSet): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(`${this._optionSetUrl}`, payload);
  }
}
