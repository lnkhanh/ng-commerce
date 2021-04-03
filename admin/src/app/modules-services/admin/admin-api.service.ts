import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BaseRSHttpClient } from '../base/base.httpclient';

@Injectable({
  providedIn: 'root',
})
export class AdminHttpClient extends BaseRSHttpClient {
  protected api = environment.adminUrl;
}
