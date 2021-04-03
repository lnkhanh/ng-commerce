import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { SaleActivityChart, TopSaleOptions } from '@app/modules/e-commerce/_models/dashboard.model';

import SaleChartConfig from './sale-chart.config';
import columns from './columns';

@Component({
  selector: 'dashboard-sale-tab',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SaleTab {
  @Input() saleActivity: SaleActivityChart;
  @Input() loading: boolean;
  @Input() topSale: number;
  @Output() onViewMore = new EventEmitter();
  @Output() onChangeTopSale = new EventEmitter();
  public definedColumns: Array<any> = columns;
  public topSaleOptions = TopSaleOptions;

  getSaleChartConfig(data) {
    const labels = data.map(item => {
      const productNameParts = [item.ProductName, item.NameUpc];
      return productNameParts.filter(i => i).join(' - ');
    });
    return SaleChartConfig('bar', labels, data);
  }

  handleOnChangeTopSale(event) {
    event.preventDefault();
    const selectedOption = parseInt(event.target.value);
    this.onChangeTopSale.emit({ pageSize: selectedOption, pageIndex: 1 });
  }
}
