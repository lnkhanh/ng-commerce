import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserType } from '../_models/user.model';
import { catchError, map } from 'rxjs/operators';
import { IResponseData, RequestParamModel } from '@shared/models/common';
import { NgCommerceHttpClient } from '@app/modules-services/ng-commerce/ng-commerce-api.service';

type AccessTokenResponseType = {
  token: string;
};

@Injectable()
export class AuthService {
  private _accountUrl = '/account';
  private _userUrl = '/users';

  constructor(private _api: NgCommerceHttpClient) { }

  // Authentication/Authorization
  login(email: string, password: string): Observable<IResponseData> {
    return this._api.post<IResponseData>(
      `${this._accountUrl}/sign-in`,
      { email, password },
      { withCredentials: true }
    );
  }

  getCurrentUser(): Observable<IResponseData> {
    return this._api.get<IResponseData>(`${this._accountUrl}/auth`);
  }

  fetchUserList(params: RequestParamModel): Observable<IResponseData> {
    const paramStr = this._api.convertObjectToParamString(params);
    return this._api.get<IResponseData>(`${this._userUrl}${paramStr}`);
  }

  fetchUserById(userId: string): Observable<IResponseData> {
    return this._api.get<IResponseData>(`${this._userUrl}/${userId}`);
  }

  archiveUser(userId: string): Observable<IResponseData> {
    return this._api.delete<IResponseData>(`${this._userUrl}/${userId}`);
  }

  updateUser(user: UserType): Observable<IResponseData> {
    console.log(user);
    return this._api.put<IResponseData>(
      `${this._userUrl}/${user.id}`,
      user
    );
  }

  createUser(user: UserType): Observable<IResponseData> {
    return this._api.post<IResponseData>(`${this._userUrl}`, user);
  }

  changePassword(userId: string, password: string): Observable<IResponseData> {
    return this._api.post<IResponseData>(
      `${this._userUrl}/change-password/${userId}`,
      { password }
    );
  }

  uploadAvatar(userId: string, body: FormData): Observable<IResponseData> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this._api.post<IResponseData>(`${this._userUrl}/upload/avatar/${userId}`, body, { headers });
  }

  removeAvatar(userId: string): Observable<IResponseData> {
    return this._api.get<IResponseData>(`${this._userUrl}/remove-avatar/${userId}`);
  }

  // Permission
  public requestPassword(email: string): Observable<any> {
    return this._api
      .get('/forgot?=' + email)
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
