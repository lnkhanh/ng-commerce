import { CartItemType } from './cart-item.type';

export type CheckoutPayload = {
	userId: string,
	storeId: string,
	storeName: string,
	tableName: string,
	note: string;
	address: string,
	products: CartItemType[],
	paymentMethod: string,
	orderCode: string,
	metadata?: string,
	source: number,
	customerId: string,
	firstName: string,
	lastName: string,
	phone: number,
	email: string
};