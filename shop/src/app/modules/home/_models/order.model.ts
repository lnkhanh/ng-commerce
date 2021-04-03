import { UserType } from '@app/modules/auth/_models/user.model';
import { ProductType } from './product.model';

export type OrderType = {
	id: string;
	code: string;
	user: UserType;
	customer: UserType;
	address: string;
	status: number;
	products: ProductType[];
	createdDate: string;
	createdTimestamp: number;
	note: string;
	source: number;
	isFirstOrder: boolean;
	total: number;
	qty: number;
};

export enum PaymentMethod {
	CASH_ON_DELIVERY = 'COD'
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