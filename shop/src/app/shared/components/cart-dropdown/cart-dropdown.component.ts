import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { CartType, CartItemType } from '@app/modules/home/_models/cart.model';
import { Observable } from 'rxjs';
import { BaseTopBarMenuComponent } from '../topbar/base-top-bar-menu.component';

@Component({
  selector: 'cart-dropdown',
  templateUrl: './cart-dropdown.component.html',
  styleUrls: ['./cart-dropdown.component.scss']
})
export class CartDropdownComponent extends BaseTopBarMenuComponent {
  @Input() cart$: Observable<CartType>;
  @Output() handleRemoveCartItem = new EventEmitter();

  constructor(protected _elRef: ElementRef) {
    super(_elRef);
  }

  onRemoveCartItem(item: CartItemType) {
    this.handleRemoveCartItem.emit(item);
  }

  /**
   * 
   * @param isOpened Menu state
   */
  onDirectPage(isOpened: boolean) {
    console.log(isOpened);
    if (isOpened) {
      this.onToggleMenu();
    }
  }
}
