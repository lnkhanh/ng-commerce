export class DashBoardFilterModel {
  companyId: string;
  storeId: number;
  fromDate: string;
  toDate: string;
  serviceId: number;

  constructor(
    data?: Partial<DashBoardFilterModel>
  ) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class OrderRevenueSummaryModel {
  OrderDate: string;
  Orders: number[];
  Revenues: number[];
  ShippingCosts: number[];
  Status: string[];
  Taxes: number[];
  TotalOrder: number;
  TotalRevenue: number;
  TotalShippingCost: number;
  TotalTax: number;
}

export class OrderRevenueDetailModel {
  OrderId: number;
  OrderDate: string;
  SoldTo: string;
  Status: string;
  Subtotal: number;
  SalesTax: number;
  Freight: string;
  OrderTotal: number;
}
export class OrderRevenueDetailResultModel {
  OrderRevenues: OrderRevenueDetailModel[];
  Users: number;
  PageIndex: number;
  PageSize: number;
  TotalPages: number;
  TotalRecords: number;
}
export class OrderRevenueParams {
  storeId: string;
  start: string;
  end: string;

  constructor({ storeId, start, end }) {
    this.storeId = storeId;
    this.start = start;
    this.end = end;
  }
}

export class OrderRevenueResponse {
  Data: OrderRevenueData[];
  Revenue: number;
  TotalOrder: number;
  TotalShippingCost: number;
  TotalTax: number;
  start: string;
  End: string;
}

export class OrderRevenueData {
  TotalAmount: number;
  OrderDate: string;
  TotalOrder: number;
}

export class SaleActivityParams {
  storeId: string;
  start: string;
  end: string;
  pageSize: number;

  constructor({ storeId, start, end, pageSize }) {
    this.storeId = storeId;
    this.start = start;
    this.end = end;
    this.pageSize = pageSize;
  }
}

export class SaleActivityResponse {
  Sales: SaleData[];
  // PageSize: number;
  // PageIndex: number;
  // TotalPages: number;
  // TotalRecords: number;
}

export class SaleActivityChart {
  Sales: SaleData[];
  SaleChartData: any[];
}

export class SaleData {
  ProductName: string;
  Price: number;
  Revenue: number;
  Quantity: number;
}

export enum TabName {
  overview = 0,
  sale = 1,
  order = 2,
}

export const TopSaleOptions = [5, 10, 20];

export enum FilterDateActionEnum {
  today = 0,
  yesterday,
  last7Days,
  last30Days,
  thisMonth,
  customRange
}
