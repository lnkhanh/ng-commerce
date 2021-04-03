import { Component, Input, Output, EventEmitter } from '@angular/core';

import SaleChartConfig from './sale-chart.config';
import OrderChartConfig from './order-chart.config';

@Component({
  selector: 'dashboard-overview-tab',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
})
export class OverviewTab {
  @Input() orderRevenue;
  @Input() loading: boolean;
  @Output() onViewMore = new EventEmitter();

  handleOnViewMore(tab) {
    this.onViewMore.emit(tab);
  }

  getSaleChartConfig(data) {
    const labels = data.map(item => item.t);
    return SaleChartConfig('line', labels, data);
  }

  getOrderChartConfig(data) {
    const labels = data.map(item => item.t);
    return OrderChartConfig('line', labels, data);
  }
}
