import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { currentUser } from '@app/modules/auth';
import { UserType } from '@app/modules/auth/_models/user.model';
import {
  FetchOrderDetailsAction,
  FetchOrderHistoryAction,
  OrderActionTypes,
  SaveOrderCriteriaAction
} from '@app/modules/account/_actions/order.actions';
import { AppState } from '@app/shared/reducers';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { OrderType } from '@app/modules/home/_models/order.model';
import { selectOrderDetails, selectOrderList, selectOrderPaging } from '../../_selectors/order.selector';
import { UpdateAccountPayload } from '../../_models/account.model';
import { RemoveAvatarAction, UpdateAccountAction, UploadAvatarAction } from '../../_actions/account.actions';
import { PaginatorModel } from '@app/shared/models/common';
import { map } from 'rxjs/operators';
import { selectIsAvailableLoading } from '@app/shared/selectors/loading.selectors';
import { FetchWishListAction, RemoveWishListAction, SaveWishListCriteriaAction } from '../../_actions/wishlist.actions';
import { WishListType } from '../../_models/wishlist.model';
import { selectWishListList, selectWishListPaging } from '../../_selectors/wishlist.selector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public user$: Observable<UserType>;
  public selectedTabSlug;
  public loading$: Observable<boolean>;

  // Order
  public orderPaginator$: Observable<PaginatorModel>;
  public orders$: Observable<OrderType[]>;
  public order$: Observable<OrderType>;

  // WishList
  public wishList$: Observable<WishListType[]>;
  public wishListPaginator$: Observable<PaginatorModel>;

  private _orderId: string;
  private destroy$: Subject<void>;

  constructor(
    private _route: ActivatedRoute,
    private _store: Store<AppState>
  ) {
    this.destroy$ = new Subject();
  }

  ngOnInit(): void {
    this._routerSubscription();
    this.init();
  }

  init() {
    this.user$ = this._store.pipe(select(currentUser));

    // Order
    this.orders$ = this._store.pipe(select(selectOrderList()));
    this.order$ = this._store.pipe(select(selectOrderDetails()));
    this.orderPaginator$ = this._store.pipe(
      select(selectOrderPaging()),
      map((pagination) => pagination)
    );

    // WishList
    this.wishList$ = this._store.pipe(select(selectWishListList()));
    this.wishListPaginator$ = this._store.pipe(
      select(selectWishListPaging()),
      map((pagination) => pagination)
    );

    this.loading$ = this._store.pipe(select(selectIsAvailableLoading));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Account
  onUpdateAccount(payload: UpdateAccountPayload) {
    this._store.dispatch(new UpdateAccountAction({ data: payload }));
  }
  // Upload user avatar
  onUploadAvatar(formData: FormData) {
    this._store.dispatch(new UploadAvatarAction({ formData }));
  }

  onRemoveAvatar() {
    this._store.dispatch(new RemoveAvatarAction());
  }
  // \Account

  // Order history
  onOrderPageChange(criteria) {
    this._store.dispatch(new SaveOrderCriteriaAction(criteria));
    this._fetchOrderHistory();
  }
  // \Order history

  // WishList
  onWishListPageChange(criteria) {
    this._store.dispatch(new SaveWishListCriteriaAction(criteria));
    this._fetchWishList();
  }

  onRemoveWishList(wishListId: string) {
    this._store.dispatch(new RemoveWishListAction(wishListId));
  }
  // \WishList

  private _routerSubscription() {
    this._route.params.subscribe((params) => {
      if (params.tab) {
        this.selectedTabSlug = params.tab;
      } else {
        if (params.orderCode) {
          this._orderId = params.orderCode;
          this.selectedTabSlug = 'order-details';
        }
      }

      this._fetchData();
    });
  }

  private _fetchData() {
    switch (this.selectedTabSlug) {
      case 'order-history': return this._fetchOrderHistory();
      case 'order-details': return this._fetchOrderDetails();
      case 'wishlist': return this._fetchWishList();
      default: console.log('No route found.');
    }
  }

  private _fetchOrderHistory() {
    return this._store.dispatch(new FetchOrderHistoryAction());
  }

  private _fetchOrderDetails() {
    return this._store.dispatch(new FetchOrderDetailsAction(this._orderId));
  }

  private _fetchWishList() {
    return this._store.dispatch(new FetchWishListAction());
  }
}
