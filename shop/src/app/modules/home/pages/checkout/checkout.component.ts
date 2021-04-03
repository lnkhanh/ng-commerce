import { Component, OnDestroy, OnInit } from '@angular/core';
import { currentUser } from '@app/modules/auth';
import { UserType } from '@app/modules/auth/_models/user.model';
import { AppState } from '@app/shared/reducers';
import { selectCart } from '@app/shared/selectors/base.selectors';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { skipWhile, takeUntil } from 'rxjs/operators';
import { CartItemType, CartType, CheckoutData, CheckoutResult, OrderSource } from '../../_models/cart.model';
import { PaymentMethod } from '../../_models/order.model';
import { CheckoutAction } from '../../_actions/cart.actions';
import { selectCheckoutResults } from '../../_selectors/cart.selector';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutSuccessModalComponent } from '../../components/checkout-success-modal/checkout-success-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public user$: Observable<UserType>;
  public cart$: Observable<CartType>;
  public isCheckoutValid: boolean;

  private _cartItems: CartItemType[];
  private _billingAddressData;

  private destroy$: Subject<void>;

  constructor(private _store: Store<AppState>, private _modalService: NgbModal, private _router: Router) {
    this.destroy$ = new Subject();
  }

  ngOnInit(): void {
    this.user$ = this._store.pipe(select(currentUser));
    this.cart$ = this._store.pipe(select(selectCart()));
    this._subscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBillingAddressFormChanges($event) {
    this._billingAddressData = $event;
    this.isCheckoutValid = !!$event && !!this._cartItems;
  }

  onCheckout() {
    if (!this.isCheckoutValid) {
      return;
    }

    const { id, firstName, lastName, phone, email, address, paymentMethod, orderNote } = this._billingAddressData;

    const payload: CheckoutData = {
      method: paymentMethod,
      cart: [...this._cartItems],
      address: address,
      storeId: "5fdf23c80c22df7ea396b753",
      tableName: "No table",
      note: orderNote,
      phone: phone,
      customerId: id,
      firstName,
      lastName,
      email,
      source: OrderSource.FRONT_SITE
    };

    this._store.dispatch(new CheckoutAction({ data: payload }));
  }

  private _subscriptions() {
    combineLatest([this.user$, this.cart$]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([user, cart]) => {
      if (user && cart) {
        let payloadValid = false;
        const { id, firstName, lastName, phone, email, address } = user;
        this._billingAddressData = { id, firstName, lastName, phone, email, address, paymentMethod: PaymentMethod.CASH_ON_DELIVERY };

        if (cart.items && cart.items.length) {
          this._cartItems = cart.items;
          payloadValid = true;
        }

        this.isCheckoutValid = payloadValid;
      }
    });

    this._store.pipe(
      takeUntil(this.destroy$),
      select(selectCheckoutResults()),
      skipWhile((rs) => !rs)
    ).subscribe((rs) => {
      this._onOpenCheckoutSuccessModal(rs);
    });
  }
  
  private _onOpenCheckoutSuccessModal(data: CheckoutResult) {
    const config: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true
    }
    const noteModal = this._modalService.open(CheckoutSuccessModalComponent, config);
    noteModal.componentInstance.orderCode = data.code;
    noteModal.componentInstance.passEntry.subscribe((orderCode) => {
      if (orderCode) {
        this._router.navigate([`/account/order-history/view/${orderCode}`]);
      } else {
        this._goToHomePage();
      }
    });
  }

  private _goToHomePage() {
    this._router.navigate([`/`]);
  }
}
