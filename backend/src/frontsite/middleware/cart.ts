import { NextFunction, Response } from "express";
import { CartItemType } from "@src/types/cart-item.type";
import { CartRepository } from "@src/repositories/cart.repository";
import Request from "@src/frontsite/types/request";
import { NOT_FOUND } from 'http-status-codes';

export const loadCart = (
	req: Request & { cart: Array<CartItemType>; visitorId: string },
	res: Response,
	next: NextFunction
) => {
	CartRepository.getCart(req.userId).then((cart) => {
		req.cart = cart;
		next();
	});
};

export const locateCartItem = (
	req: Request & {
		cart: Array<CartItemType>;
		cartItem?: CartItemType;
	},
	res: Response,
	next: NextFunction
) => {
	const cartItem = req.cart.find(
		(item) => item && item.id.toString() === req.params.cartItemId
	);

	if (!cartItem) {
		return res.status(NOT_FOUND).json({
			code: NOT_FOUND,
			message: `NO_CART_ITEM_MATCHING_THAT_ID_EXISTS_IN_THE_USER_CART`,
		});
	}

	req.cartItem = cartItem;
	next();
};