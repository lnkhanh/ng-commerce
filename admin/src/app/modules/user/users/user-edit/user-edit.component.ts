// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '@core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '@core/views/layout';
import { LayoutUtilsService, MessageType } from '@core/views/crud';
import {
  FetchUserDetailsAction,
  RemoveAvatarAction,
  UpdateUserAction,
  UploadAvatarAction,
  UserChangePasswordAction,
} from '@app/modules/auth/_actions/user.actions';
import { map, take } from 'rxjs/operators';
import { selectCurrentUser } from '@app/modules/auth/_selectors/user.selectors';
import { UserType } from '@app/modules/auth/_models/user.model';
import {
  selectLoadingState,
  selectPageLoading,
} from '@app/core/selectors/loading.selectors';
import { Location } from '@angular/common';

@Component({
  selector: 'kt-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
  public userId: string;
  public user$: Observable<UserType>;
  public selectedTab = 0;
  public loading$: Observable<boolean>;

  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private _route: ActivatedRoute,
    private _subheaderService: SubheaderService,
    private _store: Store<AppState>,
  ) {
    this.userId = this._route.snapshot.paramMap.get('id');
    this.onRouteChanges();
  }

  ngOnInit() {
    this._subheaderService.setBreadcrumbs([
      { title: 'System', page: `/user-management/users` },
      { title: 'Users', page: `/user-management/users` },
      { title: 'Edit', page: `` },
    ]);
    if (this.userId) {
      this.fetchDetails();
    } else {
      // TODO
    }
    this.user$ = this._store.pipe(select(selectCurrentUser()));
    this.loading$ = this._store.pipe(select(selectPageLoading));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  onTabChange(event: any) {
    const path = this._location.path().split('?')[0];
    this._location.replaceState(path + '?tab=' + this.selectedTab);
  }

  onBack() {
    this._location.back();
  }

  // General form
  onGeneralFormSubmit(data: UserType) {
    if (!data) {
      return;
    }

    this._store.dispatch(
      new UpdateUserAction({ data: { ...data, id: this.userId } })
    );
  }
  // End general form

  // Password form
  onUserChangePassword(newPassword: string) {
    if (!newPassword) {
      return;
    }

    this._store.dispatch(new UserChangePasswordAction({ userId: this.userId, password: newPassword }));
  }
  // End password form

  // Upload user avatar
  onUploadAvatar(formData: FormData) {
    this._store.dispatch(new UploadAvatarAction({ userId: this.userId, formData }));
  }

  onRemoveAvatar() {
    this._store.dispatch(new RemoveAvatarAction({ userId: this.userId }));
  }

  private onRouteChanges() {
    // Init paginator
    this.activatedRoute.queryParams.subscribe((params: { tab: number }) => {
      if (params.tab) {
        this.selectedTab = params.tab;
      }
    });
  }

  private fetchDetails() {
    {
      return this._store.dispatch(
        new FetchUserDetailsAction({ userId: this.userId })
      );
    }
  }
}
