import { UserType } from '@app/modules/auth/_models/user.model';

export type CartItemType = {
	id: string;
	productId: string;
	title: string;
	image: string;
	quantity: number;
	note: string;
	availableQuantity: number;
	retailPrice: number;
	salePrice: number;
	slug: string;
	categoryId: string;
	categoryName: string;
	errorMessage?: string;
};

export type CartType = {
	total: number;
	qty: number;
	items: CartItemType[];
};

export type AddCartItemData = {
	productId: string;
};

export type CheckoutData = {
	code?: string;
	method: string;
	cart: CartItemType[];
	address: string;
	storeId: string;
	storeName: string;
	tableName: string;
	note: string;
	phone?: number;
	customerId?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	source: OrderSource;
};

export type OrderType = {
	orderId: string;
	code: string;
};

export type FilterProductType = {
	catIds: string[],
	keyword?: string
};

export type OrderedProduct = {
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
	note: string;
};

export type OrderDetails = {
	id: string;
	code: string;
	storeId: string;
	storeName: string;
	tableName: string;
	user: UserType;
	address: string;
	status: number;
	products: OrderedProduct[];
	createdDate: string;
	createdTimestamp: number;
	isFirstOrder: boolean;
};

export enum OrderSource {
	WEB_ADMIN,
	APP_ADMIN
}
