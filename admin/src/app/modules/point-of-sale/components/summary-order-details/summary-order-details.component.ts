import { Component, Input, OnInit } from '@angular/core';
import { OrderStatusOptions } from '@app/modules/e-commerce/_models/order.model';
import { find } from 'lodash';
import { Observable } from 'rxjs';
import { OrderDetails } from '../../_models/pos.model';

@Component({
  selector: 'summary-order-details',
  templateUrl: './summary-order-details.component.html',
  styleUrls: ['./summary-order-details.component.scss']
})
export class SummaryOrderDetailsComponent implements OnInit {
  @Input() order$: Observable<OrderDetails>;

  constructor() { }

  ngOnInit(): void {
  }

  getOrderStatusName(status: number) {
    const found = find(OrderStatusOptions, { val: status });
    return found ? found.name : 'Unknown';
  }
}
