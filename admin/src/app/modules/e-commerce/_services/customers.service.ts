import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseData, RequestParamModel } from '@app/core/models/common';
import { AdminHttpClient } from '@app/modules-services/admin/admin-api.service';
import { UserType } from '@app/modules/auth/_models/user.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class CustomerService {
  private _customerUrl = '/customers';
  private _userUrl = '/users';

  constructor(private _adminApi: AdminHttpClient) { }

  fetchCustomerList(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._adminApi.convertObjectToParamString(params);
    return this._adminApi.get<IResponseData>(
      `${this._customerUrl}${paramStr}`
    );
  }

  fetchCustomerById(customerId: string): Observable<IResponseData> {
    return this._adminApi.get<IResponseData>(`${this._customerUrl}/${customerId}`);
  }

  archiveCustomer(customerId: string): Observable<IResponseData> {
    return this._adminApi.delete<IResponseData>(
      `${this._customerUrl}/${customerId}`
    );
  }

  updateCustomer(user: UserType): Observable<IResponseData> {
    return this._adminApi.put<IResponseData>(
      `${this._customerUrl}/${user.id}`,
      user
    );
  }

  createCustomer(user: UserType): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(`${this._customerUrl}`, user);
  }

  changePassword(customerId: string, password: string): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(
      `${this._customerUrl}/change-password/${customerId}`,
      { password }
    );
  }

  uploadAvatar(userId: string, body: FormData): Observable<IResponseData> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this._adminApi.post<IResponseData>(`${this._userUrl}/upload/avatar/${userId}`, body, { headers });
  }

  removeAvatar(userId: string): Observable<IResponseData> {
    return this._adminApi.get<IResponseData>(`${this._userUrl}/remove-avatar/${userId}`);
  }
}
