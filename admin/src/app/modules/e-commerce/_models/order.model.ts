export type OrderType = {
	id: string;
	code: string;
	user: string;
	address: string;
	status: number;
	products: Array<OrderedItemType>;
	createdDate: string;
	displayMessage?: string;
	createdTimestamp: number;
	shippedDate?: string;
	isFirstOrder?: boolean;
	metadata?: any;
	statuses?: Array<OrderStatus>;
};

export type OrderedItemType = {
	id: string;
	productId: string;
	title: string;
	image: string;
	quantity: number;
	availableQuantity: number;
	retailPrice: number;
	salePrice: number;
	slug: string;
	categoryId: string;
	categoryName: string;
	errorMessage?: string;
};


export type OrderStatus = {
	date: Date;
	status: string;
	content: string;
};

export enum PaymentGateways {
	CASH = 'Cash'
}

export enum OrderStatuses {
	Failed = -1,
	New = 0,
	Preparing = 1,
	Shipping = 2,
	Ready = 3,
	Completed = 4,
	Cancelled = 5
}

export const OrderStatusNames = [
	'New',
	'Preparing',
	'Shipping',
	'Ready',
	'Completed',
	'Cancelled'
];

export const OrderStatusOptions = [
	{
		val: OrderStatuses.New,
		name: OrderStatusNames[OrderStatuses.New]
	},
	{
		val: OrderStatuses.Preparing,
		name: OrderStatusNames[OrderStatuses.Preparing]
	},
	{
		val: OrderStatuses.Ready,
		name: OrderStatusNames[OrderStatuses.Ready]
	},
	{
		val: OrderStatuses.Shipping,
		name: OrderStatusNames[OrderStatuses.Shipping]
	},
	{
		val: OrderStatuses.Completed,
		name: OrderStatusNames[OrderStatuses.Completed]
	},
	{
		val: OrderStatuses.Cancelled,
		name: OrderStatusNames[OrderStatuses.Cancelled]
	}
];
