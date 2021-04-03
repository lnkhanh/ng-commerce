import { NextFunction, Request, Response } from "express";
import { NOT_FOUND } from "http-status-codes";

import { CartItemType } from "@src/types/cart-item.type";
import { CartRepository } from "@src/repositories/cart.repository";

export const loadCart = (
  req: Request & { cart: Array<CartItemType>; visitorId: string },
  res: Response,
  next: NextFunction
) => {
  CartRepository.getCart(req.visitorId).then((cart) => {
    req.cart = cart;
    next();
  });
};

export const locateCartItem = (
  req: Request & {
    cart: Array<CartItemType>;
    visitorId: string;
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
