export type OrderRevenueItemType = {
	TotalAmount: number;
	OrderDate: string;
	TotalOrder: number;
};

export type OrderRevenueDataType = {
	Data: OrderRevenueItemType[];
	Revenue: number;
	Users: number;
	Start: string;
	End: string;
	TotalOrder: number;
};

// Top products sales
export type TopProductSaleType = {
	ProductName: string;
	Revenue: number;
	Quantity: number;
	Price: number;
}
