import { Component, Input, OnInit } from '@angular/core';
import { CartType } from '../../_models/cart.model';

@Component({
  selector: 'checkout-items',
  templateUrl: './checkout-items.component.html',
  styleUrls: ['./checkout-items.component.css']
})
export class CheckoutItemsComponent implements OnInit {
  @Input() cart: CartType;

  constructor() { }

  ngOnInit(): void {
  }

}
