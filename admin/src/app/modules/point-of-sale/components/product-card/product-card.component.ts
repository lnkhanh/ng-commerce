import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductType } from '@app/modules/e-commerce';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product: ProductType;
  @Output() handleAddCartItem = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onAddCartItem() {
    if (!this.product) {
      return;
    }

    this.handleAddCartItem.emit(this.product.id);
  }
}
