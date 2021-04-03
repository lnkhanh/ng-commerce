// Angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { catchError, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
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
import { AppState } from '@shared/reducers';
import { environment } from '../../../../environments/environment';
import { isUserLoaded } from '../_selectors/auth.selectors';
import { UserType } from '../_models/user.model';
import { Credential } from '@app/shared/services/credential.service';

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.Login),
    tap((action) => {
      if (action.payload.user) {
        localStorage.setItem(
          environment.localUserKey,
          JSON.stringify(action.payload.user)
        );
      }

      this.store.dispatch(new UserRequested());
    }),
    catchError((error, caught) => {
      return caught;
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<Logout>(AuthActionTypes.Logout),
    tap(() => {
      localStorage.removeItem(environment.authAccessToken);
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.returnUrl },
      });
    })
  );

  @Effect({ dispatch: false })
  register$ = this.actions$.pipe(
    ofType<Register>(AuthActionTypes.Register),
    switchMap(({ payload }) => {
      return this.auth.createUser(payload);
    }),
    tap((rs) => {
      if (rs && rs.data && rs.data.token && rs.data.user) {
        this.credential.setAccessToken(rs.data.token);
        localStorage.setItem(
          environment.localUserKey,
          JSON.stringify(rs.data.user)
        );
      } else {
        throw new Error();
      }
    }),
    catchError((error, caught) => {
      localStorage.removeItem(environment.authAccessToken);
      return caught;
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
        this.store.dispatch(new UserLoaded({ user: rs.data }));
      } else {
        this.store.dispatch(new Logout());
      }
    }),
    catchError((error, caught) => {
      localStorage.removeItem(environment.authAccessToken);
      return caught;
    })
  );

  @Effect()
  init$: Observable<Action> = defer(() => {
    const userToken = this.credential.getAccessToken();
    let observableResult = of({ type: 'NO_ACTION' });

    if (userToken) {
      const user: UserType = this.credential.getCurrentUser();
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
    private credential: Credential
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.returnUrl = event.url;
      }
    });
  }
}
