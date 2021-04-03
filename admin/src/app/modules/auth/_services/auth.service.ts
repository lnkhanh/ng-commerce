import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User, UserType } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { QueryParamsModel, QueryResultsModel } from '@app/core/views/crud';
import { IResponseData, RequestParamModel } from '@app/core/models/common';
import { AdminHttpClient } from '@app/modules-services/admin/admin-api.service';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';

@Injectable()
export class AuthService {
  private _accountUrl = '/account';
  private _userUrl = '/users';

  constructor(private _adminApi: AdminHttpClient) {}
  // Authentication/Authorization
  login(email: string, password: string): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(
      `${this._accountUrl}/sign-in`,
      { email, password },
      { withCredentials: true }
    );
  }

  logout() {
    return this._adminApi.get<IResponseData>(`${this._accountUrl}/sign-out`);
  }

  getCurrentUser(): Observable<IResponseData> {
    return this._adminApi.get<IResponseData>(`${this._accountUrl}`);
  }

  fetchUserList(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._adminApi.convertObjectToParamString(params);
    return this._adminApi.get<IResponseData>(`${this._userUrl}${paramStr}`);
  }

  fetchUserById(userId: string): Observable<IResponseData> {
    return this._adminApi.get<IResponseData>(`${this._userUrl}/${userId}`);
  }

  archiveUser(userId: string): Observable<IResponseData> {
    return this._adminApi.delete<IResponseData>(`${this._userUrl}/${userId}`);
  }

  updateUser(user: UserType): Observable<IResponseData> {
    console.log(user);
    return this._adminApi.put<IResponseData>(
      `${this._userUrl}/${user.id}`,
      user
    );
  }

  createUser(user: UserType): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(`${this._userUrl}`, user);
  }

  changePassword(userId: string, password: string): Observable<IResponseData> {
    return this._adminApi.post<IResponseData>(
      `${this._userUrl}/change-password/${userId}`,
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

  // Permission
  getAllPermissions(): Observable<Permission[]> {
    return this._adminApi.get<Permission[]>(API_PERMISSION_URL);
  }

  public requestPassword(email: string): Observable<any> {
    return this._adminApi
      .get(API_USERS_URL + '/forgot?=' + email)
      .pipe(catchError(this.handleError('forgot-password', [])));
  }

  /*
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }
}
