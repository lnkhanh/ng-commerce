// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '@core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '@core/views/layout';
import { LayoutUtilsService, MessageType } from '@core/views/crud';
import {
  FetchCustomerDetailsAction,
  UpdateCustomerAction,
  CustomerChangePasswordAction,
  UploadAvatarAction,
  RemoveAvatarAction,
} from '@app/modules/e-commerce/_actions/customer.actions';
import { selectCurrentCustomer } from '@app/modules/e-commerce/_selectors/customer.selectors';
import { UserType } from '@app/modules/auth/_models/user.model';
import {
  selectPageLoading,
} from '@app/core/selectors/loading.selectors';
import { Location } from '@angular/common';

@Component({
  selector: 'kt-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit, OnDestroy {
  public userId: string;
  public user$: Observable<UserType>;
  public selectedTab = 0;
  public loading$: Observable<boolean>;

  private subscriptions: Subscription[] = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
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
      { title: 'eCommerce', page: `/ecommerce/customers` },
      { title: 'Customers', page: `/ecommerce/customers` },
      { title: 'Edit', page: `` },
    ]);

    if (this.userId) {
      this.fetchDetails();
    } else {
      // TODO
    }
    this.user$ = this._store.pipe(select(selectCurrentCustomer()));
    this.loading$ = this._store.pipe(select(selectPageLoading));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  onTabChange(event: any) {
    const path = this._location.path().split('?')[0];
    this._location.replaceState(path + '?tab=' + this.selectedTab);
  }

  // General form
  onGeneralFormSubmit(data: UserType) {
    if (!data) {
      return;
    }

    this._store.dispatch(
      new UpdateCustomerAction({ data: { ...data, id: this.userId } })
    );
  }
  // End general form

  // Password form
  onUserChangePassword(newPassword: string) {
    if (!newPassword) {
      return;
    }

    this._store.dispatch(
      new CustomerChangePasswordAction({
        customerId: this.userId,
        password: newPassword,
      })
    );
  }
  // End password form

  // Upload user avatar
  onUploadAvatar(formData: FormData) {
    this._store.dispatch(new UploadAvatarAction({ userId: this.userId, formData }));
  }

  onRemoveAvatar() {
    this._store.dispatch(new RemoveAvatarAction({ userId: this.userId }));
  }

  onBack() {
    this._location.back();
  }

  private onRouteChanges() {
    // Init paginator
    this._activatedRoute.queryParams.subscribe((params: { tab: number }) => {
      if (params.tab) {
        this.selectedTab = params.tab;
      }
    });
  }

  private fetchDetails() {
    {
      return this._store.dispatch(
        new FetchCustomerDetailsAction({ customerId: this.userId })
      );
    }
  }
}
