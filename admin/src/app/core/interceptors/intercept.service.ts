// Angular
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
// RxJS
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { NavigationEnd, Router } from '@angular/router';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
  private returnUrl: string;

  constructor(private _router: Router) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.returnUrl = event.url;
      }
    });
  }
  // intercept request and add token
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            // console.log('all looks good');
            // http response status code
            // console.log(event.status);
          }
        },
        (error) => {
          if (error.status === 401) {
            this._doLogout();
          }
          return throwError(error);
        }
      )
    );
  }

  private _doLogout() {
    localStorage.removeItem(environment.localUserKey);
    this._router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.returnUrl },
    });
  }
}
