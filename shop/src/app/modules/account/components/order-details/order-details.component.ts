import { Component, Input, OnInit } from '@angular/core';
import { OrderType } from '@app/modules/home/_models/order.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  @Input() order$: Observable<OrderType>;

  constructor() { }

  ngOnInit(): void {
  }

}
