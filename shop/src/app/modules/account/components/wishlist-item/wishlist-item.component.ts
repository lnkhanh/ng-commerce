import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WishListType } from '../../_models/wishlist.model';

@Component({
  selector: 'wishlist-item',
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.scss']
})
export class WishListItemComponent implements OnInit {
  @Input() item: WishListType;
  @Output() handleRemoveWishList = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onRemoveWishList() {
    this.handleRemoveWishList.emit();
  }
}
