import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpHeaders,
  HttpParams,
  HttpHandler
} from '@angular/common/http';

import { Observable } from 'rxjs';
import * as moment from 'moment';
// Lodash
import { isEmpty, chain, map, isObject, cloneDeep } from 'lodash-es';
import { Credential } from '@shared/services/credential.service';

@Injectable({
  providedIn: 'root'
})
export class BaseRSHttpClient extends HttpClient {
  protected api: string;
  protected withoutAccessTokenKey = false;

  protected adminConfig = AdminConfig;

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
    try {
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

      if (this.credential.accessTokenKey) {
        headers = headers.set("Authorization", `${this.credential.accessTokenKey}`);
      }

      options.headers = headers;
      options.withCredentials = true;

      if (options.body instanceof Object && !(options.body instanceof FormData)) {
        const body: any = cloneDeep(options.body);
        this.browseTheObject(body);

        options.body = body;
      }
      const req = super.request(first as string, url, options as any);
      return req;
    } catch (error) {
      console.error('line 70 - error', error);
    }

    return null;
  }

  private browseTheObject(obj: object): void {
    map(obj, (value, key) => {
      if (moment.isMoment(value)) {
        obj[key] = this.convertDateTime(value);
      }
      if (isObject(value)) {
        this.browseTheObject(value);
      }
    });
  }

  private convertDateTime(value): string {
    return moment(value).format(this.adminConfig.format.apiDateTime);
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
    if (isEmpty(query)) {
      return '';
    }

    let str = "?";
    for (var key in query) {
      if (str != "") {
        str += "&";
      }
      str += key + "=" + query[key];
    }

    return str;
  }
}

export type HttpObserve = 'body' | 'events' | 'response';

import { NgModule } from '@angular/core';
import { AdminConfig } from '@shared/configs/admin.config';

@NgModule({
  exports: []
})
export class BaseGatewayModules { }
