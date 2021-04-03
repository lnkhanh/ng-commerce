// Angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { catchError, filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
// Auth actions
import {
  AuthActionTypes,
  Login,
  Logout,
  Register,
  UserLoaded,
  UserRequested,
} from '../_actions/auth.actions';
import { AuthService } from '../_services/index';
import { AppState } from '@core/reducers';
import { environment } from '../../../../environments/environment';
import { isUserLoaded } from '../_selectors/auth.selectors';
import { UserType } from '../_models/user.model';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.Login),
    tap((action) => {
      localStorage.setItem(
        environment.localUserKey,
        JSON.stringify(action.payload.user)
      );
      this.store.dispatch(new UserRequested());
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('Email or password incorrectly.');
      return caught;
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<Logout>(AuthActionTypes.Logout),
    mergeMap(() => this.auth.logout()),
    tap(() => {
      localStorage.removeItem(environment.localUserKey);
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.returnUrl },
      });
    })
  );

  @Effect({ dispatch: false })
  register$ = this.actions$.pipe(
    ofType<Register>(AuthActionTypes.Register),
    tap((action) => {
      localStorage.setItem(environment.localUserKey, action.payload.authToken);
    })
  );

  @Effect({ dispatch: false })
  loadUser$ = this.actions$.pipe(
    ofType<UserRequested>(AuthActionTypes.UserRequested),
    withLatestFrom(this.store.pipe(select(isUserLoaded))),
    filter(([action, _isUserLoaded]) => !_isUserLoaded),
    mergeMap(([action, _isUserLoaded]) => this.auth.getCurrentUser()),
    tap((rs) => {
      if (rs && rs.data) {
        this.store.dispatch(new UserLoaded({ user: rs.data.user }));
      } else {
        this.store.dispatch(new Logout());
      }
    }),
    catchError((error, caught) => {
      this.toastService.showDanger('User not found.');
      return caught;
    })
  );

  @Effect()
  init$: Observable<Action> = defer(() => {
    const userToken = localStorage.getItem(environment.localUserKey);
    let observableResult = of({ type: 'NO_ACTION' });

    if (userToken) {
      const user: UserType = JSON.parse(userToken);
      observableResult = of(new Login({ user }));
    }
    return observableResult;
  });

  private returnUrl: string;

  constructor(
    private actions$: Actions,
    private router: Router,
    private auth: AuthService,
    private store: Store<AppState>,
    private toastService: ToastService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.returnUrl = event.url;
      }
    });
  }
}
