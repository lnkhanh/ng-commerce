import { Component, OnDestroy, OnInit } from '@angular/core';
import { FetchAllCategoriesAction, FetchUserCartAction, ToggleCartAction, ToggleMenuProfileAction } from '@shared/actions/base.actions';
import { CategoryType } from '@app/modules/home/_models/category.model';
import { AppState } from '@app/shared/reducers';
import { selectCart, selectCartState, selectCategoryList, selectProfileMenuState } from '@app/shared/selectors/base.selectors';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { currentUser, Logout } from '@app/modules/auth';
import { UserType } from '@app/modules/auth/_models/user.model';
import { CartType, CartItemType } from '@app/modules/home/_models/cart.model';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { RemoveCartItemAction } from '@app/modules/home/_actions/cart.actions';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit, OnDestroy {
  public categories$: Observable<CategoryType[]>;
  public isMenuProfileOpened$: Observable<boolean>;
  public isCartOpened$: Observable<boolean>;
  public user$: Observable<UserType>;
  public cart$: Observable<CartType>;

  private destroy$: Subject<void>;

  constructor(private _store: Store<AppState>) {
    this._fetchAllCategories();
    this.destroy$ = new Subject();
  }

  ngOnInit() {
    this.init();
    this._subscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  init() {
    this.categories$ = this._store.pipe(select(selectCategoryList()));
    this.isMenuProfileOpened$ = this._store.pipe(select(selectProfileMenuState()));
    this.isCartOpened$ = this._store.pipe(select(selectCartState()));
    this.user$ = this._store.pipe(select(currentUser));
    this.cart$ = this._store.pipe(select(selectCart()));
  }

  onToggleCart() {
    this._store.dispatch(new ToggleCartAction());
  }

  onRemoveCartItem(cartItem: CartItemType) {
    this._store.dispatch(new RemoveCartItemAction({ itemId: cartItem.id}));
  }

  onToggleProfileMenu() {
    this._store.dispatch(new ToggleMenuProfileAction());
  }

  onUserLogout() {
    this.onToggleProfileMenu();
    this._store.dispatch(new Logout());
  }

  private _fetchAllCategories() {
    return this._store.dispatch(new FetchAllCategoriesAction());
  }

  private _fetchCart() {
    return this._store.dispatch(new FetchUserCartAction());
  }

  private _subscriptions() {
    this.user$.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe((user) => {
      if (user) {
        this._fetchCart();
      }
    });
  }
}
