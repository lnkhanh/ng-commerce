import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TabName } from '../../../_models/dashboard.model';

@Component({
  selector: 'dashboard-overview',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
})
export class Overview {
  @Input() totalSales: number;
  @Input() totalOrders: number;
  @Input() totalTax: number;
  @Input() users: number;
  @Output() onViewMore = new EventEmitter();
  public tabName = TabName;

  handleOnViewMore(tab) {
    this.onViewMore.emit(tab);
  }
}
