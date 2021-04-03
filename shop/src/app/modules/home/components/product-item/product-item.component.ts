import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductType } from '../../_models/product.model';

@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product: ProductType;
  @Output() handleAddToCart = new EventEmitter();
  @Output() handleAddToWishList = new EventEmitter();
  @Output() handleOpenProductQuickViewModal = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onAddToCart() {
    this.handleAddToCart.emit();
  }

  onAddToWishList() {
    this.handleAddToWishList.emit();
  }

  onOpenProductQuickViewModal() {
    this.handleOpenProductQuickViewModal.emit({...this.product});
  }
}
