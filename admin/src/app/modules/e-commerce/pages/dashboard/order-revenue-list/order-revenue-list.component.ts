import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';

// import { PaginatorModel } from '@app/core-ui/_base/crud/models/_base.model';

import { OrderRevenueDetailModel } from '@app/modules/e-commerce/_models/dashboard.model';
import { AdminConfig } from '@app/core';
import { OrderStatusNames } from '@app/modules/e-commerce/_models/order.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'order-revenue-list',
  templateUrl: './order-revenue-list.component.html',
  styleUrls: ['./order-revenue-list.component.scss']
})
export class OrderRevenueListComponent implements OnInit, OnChanges {
  @Input() loading: boolean;
  @Input() data: OrderRevenueDetailModel[];
  @Input() paginator: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginatorEl: MatPaginator;
  public orderStatus = OrderStatusNames;

  public displayedColumns = [
    'orderId', 'orderDate', 'soldTo', 'status',
    'merchTotal', 'salesTax', 'freight', 'orderTotal'
  ];

  public pageSizeOptions: number[] = AdminConfig.pageSizeOptions;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(change: SimpleChanges) {
    if (change.paginator && change.paginator.currentValue) {
      const dataPaignator = change.paginator.currentValue;
      this.paginatorEl.pageIndex = dataPaignator.pageIndex;
    }
  }

  onChangePage(page: any) {
    const data = {
      pageSize: page.pageSize,
      pageIndex: page.pageIndex,
    };
    this.onChange.emit(data);
  }

}
