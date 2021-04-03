import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserType } from '@app/modules/auth/_models/user.model';
import { CartType, CartItemType } from '@app/modules/home/_models/cart.model';
import { CategoryType } from '@app/modules/home/_models/category.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Input() categories$: Observable<CategoryType[]>;
  @Input() isMenuProfileOpened$: Observable<boolean>;
  @Input() isCartOpened$: Observable<boolean>;
  @Input() user$: Observable<UserType>;
  @Input() cart$: Observable<CartType>;
  @Output() handleToggleCart = new EventEmitter();
  @Output() handleToggleProfileMenu = new EventEmitter();
  @Output() handleRemoveCartItem = new EventEmitter();
  @Output() handleLogout = new EventEmitter();

  public logo = environment.logo;
  public collapse: boolean = false;

  constructor(private _router: Router) { }

  ngOnInit(): void { }

  isLinkActive(url: string) {
    return this._router.url === url;
  }

  onToggleCart() {
    this.handleToggleCart.emit();
  }

  onRemoveCartItem(cartItem: CartItemType) {
    this.handleRemoveCartItem.emit(cartItem);
  }

  onToggleProfileMenu() {
    this.handleToggleProfileMenu.emit();
  }

  onLogout() {
    this.handleLogout.emit();
  }
}
