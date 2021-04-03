import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import find from 'lodash-es/find';
import { OrderType, OrderStatuses, OrderStatusOptions } from '@app/modules/home/_models/order.model';
import { PaginatorModel } from '@app/shared/models/common';

@Component({
  selector: 'order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  @Input() orders$: Observable<OrderType[]>;
  @Output() handlePageChange = new EventEmitter();

  // Paginator
  @Input() paginator$: Observable<PaginatorModel>;
  @Input() loadingList$: Observable<boolean>;
  public pageSizeOptions: number[] = [10, 15, 20, 25, 50];

  constructor() { }

  ngOnInit(): void {
  }

  getOrderStatusCls(status: number) {
    if (OrderStatuses.Completed === status) return 'badge-success';
    return 'badge-warning';
  }

  getOrderStatusName(status: number) {
    const found = find(OrderStatusOptions, { val: status });
    return found ? found.name : 'Unknown';
  }

  handleOnChangePaging(data) {
    this.handlePageChange.emit({ ...data });
  }
}
