import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgCommerceHttpClient } from '@app/modules-services/ng-commerce/ng-commerce-api.service';
import { IResponseData } from '@app/shared/models/common';
import { Observable } from 'rxjs';
import { UpdateAccountPayload } from '../_models/account.model';

@Injectable()
export class AccountService {
  private _accountUrl = '/account';
  constructor(private _api: NgCommerceHttpClient) { }

  updateAccount(payload: UpdateAccountPayload): Observable<IResponseData> {
    return this._api.put<IResponseData>(
      `${this._accountUrl}`,
      payload
    );
  }

  changePassword(accountId: string, password: string): Observable<IResponseData> {
    return this._api.post<IResponseData>(
      `${this._accountUrl}/change-password/${accountId}`,
      { password }
    );
  }

  uploadAvatar(body: FormData): Observable<IResponseData> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this._api.post<IResponseData>(`${this._accountUrl}/upload/avatar`, body, { headers });
  }

  removeAvatar(): Observable<IResponseData> {
    return this._api.get<IResponseData>(`${this._accountUrl}/remove-avatar`);
  }
}