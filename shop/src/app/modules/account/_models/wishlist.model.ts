export type WishListType = {
	id: string;
	createdAt: string;
	productId: string;
	name: string;
	slug: string;
	description: string;
	salePrice?: number;
	retailPrice: number;
	images: string[];
	categoryId: string;
};