import { Component, Input, OnInit } from '@angular/core';
import { OrderType } from '@app/modules/home/_models/order.model';

@Component({
  selector: 'order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {
  @Input() order: OrderType;

  constructor() { }

  ngOnInit(): void {
    console.log(this.order);
  }

}
