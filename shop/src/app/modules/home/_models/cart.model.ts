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
	quantity: number;
};

export type CheckoutData = {
	code?: string;
	method: string;
	cart: CartItemType[];
	address: string;
	storeId: string;
	storeName?: string;
	tableName: string;
	note: string;
	phone?: number;
	customerId?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	source: OrderSource;
};

export type CheckoutResult = {
	code: string;
	orderId: string;
};

export enum OrderSource {
	WEB_ADMIN,
	APP_ADMIN,
	FRONT_SITE
}
