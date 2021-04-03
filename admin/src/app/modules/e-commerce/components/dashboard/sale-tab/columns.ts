import { formatNumber } from '@angular/common';
import { SaleData } from '@app/modules/e-commerce/_models/dashboard.model';
import { AdminConfig } from '@app/core';
import { CurrencyPipe } from '@app/shared/pipes/currency.pipe';

const columns = [
  {
    title: 'Product Name',
    field: 'ProductName',
    value: (row: SaleData) => {
      return `${row.ProductName || '--'}`;
    }
  },
  {
    title: 'Total Quantity Sold',
    field: 'Quantity',
    value: (row: SaleData) => {
      return row.Quantity ? formatNumber(row.Quantity, AdminConfig.locale) : '--';
    }
  },
  {
    title: 'Revenue',
    field: 'Revenue',
    format: CurrencyPipe,
    value: (row: SaleData) => {
      return row.Revenue || 0;
    }
  },
];

export default columns;
