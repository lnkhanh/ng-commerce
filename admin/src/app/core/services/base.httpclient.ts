import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpHeaders,
  HttpParams,
  HttpHandler,
} from '@angular/common/http';

import { Observable } from 'rxjs';

// Lodash
import { isEmpty, chain } from 'lodash';

import { Credential } from './credential.service';

@Injectable({
  providedIn: 'root',
})
export class BaseHttpClient extends HttpClient {
  protected api: string;
  protected withoutAccessTokenKey = false;

  constructor(handler: HttpHandler, private credential: Credential) {
    super(handler);
  }

  request(
    first: string | HttpRequest<any>,
    url?: string,
    options: {
      body?: any;
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: HttpObserve;
      params?: HttpParams | { [param: string]: string | string[] };
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    } = {}
  ): Observable<any> {
    const override = {};
    if (!options) {
      options = {};
    }
    url = this.api + url;

    // token
    let headers: HttpHeaders | undefined;
    if (options.headers instanceof HttpHeaders) {
      headers = options.headers;
    } else {
      headers = new HttpHeaders(options.headers);
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    }
    if (this.credential.accessTokenKey && !this.withoutAccessTokenKey) {
      headers = headers.set('X-MCMAccessToken', this.credential.accessTokenKey);
    }

    options.headers = headers;
    const req = super.request(first as string, url, options as any);
    return req;
  }

  /**
   * Convert Object to params string.
   * Use lodash function set.
   * Ex: set(query, 'keyword', 'abcd')
   *
   * @param query: Object { keyword: abcd, pageSize: 0 }
   * @returns string: ?keyword=abcd&pageSize=0
   */
  convertObjectToParamString(query: {}): string {
    return isEmpty(query)
      ? ''
      : '?' +
          chain(query)
            .map((value: string | number, key: string) => `${key}=${value}`)
            .join('&')
            .value();
  }
}

export type HttpObserve = 'body' | 'events' | 'response';

import { NgModule } from '@angular/core';

@NgModule({
  exports: [],
})
export class BaseGatewayModules {}
