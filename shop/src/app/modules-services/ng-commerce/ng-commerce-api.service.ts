import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BaseRSHttpClient } from '../base/base.httpclient';

@Injectable({
  providedIn: 'root',
})
export class NgCommerceHttpClient extends BaseRSHttpClient {
  protected api = environment.ngCommerceUrl;
}
