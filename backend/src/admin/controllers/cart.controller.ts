import { Request, Response } from "express";
import { findIndex } from "lodash";
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "http-status-codes";

import { wrap } from "@src/server";
import { CartItemType } from "@src/types/cart-item.type";
import { CartRepository } from "@src/repositories/cart.repository";
import { logger } from "@src/infrastructure/logger";
import { IResponseData, ResponseStatus } from '@src/types/common.type';

export const MAX_QUANTITY = 5;

export const getCart = wrap(
  async (
    req: Request & {
      cart: Array<CartItemType>;
    },
    res: Response
  ) => {
    const userCart = CartRepository.cartSummary(req.cart);

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: userCart,
    };

    return res.status(OK).json(data);
  }
);

export const addItem = wrap(
  async (
    req: Request & {
      cart: Array<CartItemType>;
      visitorId: string;
      cartItem?: CartItemType;
    },
    res: Response
  ) => {
    const existing = req.cart.find(
      (item) => item.productId.toString() === req.body.productId
    );

    if (existing) {
      req.cartItem = existing;
      req.params.cartItemId = existing.id;
      req.body.quantity = existing.quantity + 1;

      return updateItem(req, res);
    }

    let cartItem: CartItemType;

    try {
      cartItem = await CartRepository.addItemToCart(
        req.visitorId,
        req.body.productId,
        1,
        req.body.note
      );

      if (cartItem.errorMessage) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          code: INTERNAL_SERVER_ERROR,
          message: cartItem.errorMessage
            ? cartItem.errorMessage
            : "COULD_NOT_ADD_ITEM_TO_CART",
        });
      }
    } catch (error) {
      const message = error.message
        ? error.message
        : "COULD_NOT_ADD_ITEM_TO_CART";
      logger.error("COULD_NOT_ADD_ITEM_TO_CART", {
        error,
      });
      return res.status(INTERNAL_SERVER_ERROR).json({
        code: INTERNAL_SERVER_ERROR,
        message,
      });
    }

    if (req.cart) {
      req.cart.push(cartItem);
    }

    const userCart = CartRepository.cartSummary(req.cart);

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: userCart,
    };

    return res.status(OK).json(data);
  }
);

export const updateItem = wrap(
  async (
    req: Request & {
      cart: Array<CartItemType>;
      visitorId: string;
      cartItem?: CartItemType;
    },
    res: Response
  ) => {
    let cartItem;
    const { quantity } = req.body;

    try {
      if (quantity <= 0) {
        return removeItem(req, res);
      }

      cartItem = await CartRepository.updateCartItem(
        req.params.cartItemId,
        req.body.quantity,
        req.body.note
      );
    } catch (error) {
      console.log(error);
      return res.status(INTERNAL_SERVER_ERROR).json({
        code: INTERNAL_SERVER_ERROR,
        message: "COULD_NOT_UPDATE_ITEM_QUANTITY",
      });
    }

    if (req.cart) {
      const itemIdx = findIndex(req.cart, { id: cartItem.id });
      if (itemIdx !== -1) {
        req.cart[itemIdx] = cartItem;
      }
    }

    const userCart = CartRepository.cartSummary(req.cart);

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: userCart,
    };

    return res.status(OK).json(data);
  }
);

export const removeItem = wrap(
  async (
    req: Request & { cart: Array<CartItemType>; visitorId: string },
    res: Response
  ) => {
    let removed;
    const { cartItemId } = req.params;

    try {
      if (!cartItemId) {
        throw new Error();
      }

      removed = await CartRepository.removeItemFromCart(cartItemId);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        code: INTERNAL_SERVER_ERROR,
        message: "SOMETHING_WENT_WRONG_WHILE_REMOVING_THE_ITEM_FROM_THE_CART",
      });
    }

    if (removed && req.cart) {
      // ToString all ids Mongo type.
      const cart = JSON.parse(JSON.stringify(req.cart));
      const itemIdx = findIndex(cart, { id: cartItemId });
      console.log(itemIdx);
      if (itemIdx !== -1) {
        req.cart.splice(itemIdx, 1);
      }

      const userCart = CartRepository.cartSummary(req.cart);

      const data: IResponseData = {
        status: ResponseStatus.SUCCESS,
        data: userCart,
      };

      return res.status(OK).json(data);
    }

    // If this error is returned it means that something else deleted the item
    // between the middleware loading the cart items and the delete request happening.
    res.status(NOT_FOUND).json({
      code: NOT_FOUND,
      message: "ITEM_NOT_FOUND_IN_CART",
    });
  }
);

export const removeCartItems = wrap(
  async (
    req: Request & { cart: Array<CartItemType>; visitorId: string },
    res: Response
  ) => {
    let removed;

    try {
      removed = await CartRepository.removeItemsFromCart(req.body.cartItemIds);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        code: INTERNAL_SERVER_ERROR,
        message: "SOMETHING_WENT_WRONG_WHILE_REMOVING_THE_ITEM_FROM_THE_CART",
      });
    }

    if (removed && req.cart) {
      req.body.cartItemIds.forEach((cartItemId: string) => {
        const itemIdx = findIndex(req.cart, { id: cartItemId });
        if (itemIdx !== -1) {
          req.cart.splice(itemIdx, 1);
        }
      });

      const userCart = CartRepository.cartSummary(req.cart);

      const data: IResponseData = {
        status: ResponseStatus.SUCCESS,
        data: userCart,
      };

      return res.status(OK).json(data);
    }

    // If this error is returned it means that something else deleted the item
    // between the middleware loading the cart items and the delete request happening.
    res.status(NOT_FOUND).json({
      code: NOT_FOUND,
      message: "ITEM_NOT_FOUND_IN_CART",
    });
  }
);
