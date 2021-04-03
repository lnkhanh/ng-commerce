import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import { CartItemType } from '@src/types/cart-item.type';
import { CartRepository } from '@src/repositories/cart.repository';
import { wrap } from '@src/server';
import { IAccountModel } from '@src/types/account.type';
import { ISessionRequest } from "@src/types/account/session-request.type";

/**
 * Validates that all basic order data exists and matches expected patterns.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const validateRequiredData = (req: Request & { isVisitor: boolean }, res: Response, next: NextFunction) => {
  if (!req.body.address) {
    return res.status(BAD_REQUEST).json({
      code: BAD_REQUEST,
      message: ['ADDRESS_REQUIRED'],
    });
  }

  const errors = [];
  let data = null;

  // if (!req.body.phone) {
  //   errors.push('PHONE_REQUIRED');
  // }

  if (!req.body.cart || req.body.cart.length === 0) {
    errors.push('THERE_ARE_NO_ITEMS_IN_YOUR_ORDER');
    data = {
      cart: [],
    };
  }

  if (errors.length) {
    return res.status(BAD_REQUEST).json({
      code: BAD_REQUEST,
      message: errors,
      data,
    });
  }
  next();
};

/**
 * Validates that the cart is present and matches the cart data we have stored in the session.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const validateCart = wrap(
  async (
    req: ISessionRequest & { cart?: Array<CartItemType>; },
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.user.id;
    const serverCarts = req.cart ? req.cart : await CartRepository.getCart(userId);
    const clientCarts = req.body.cart;

    try {
      // Validates that all items in the cart are available in the selected quantity and belong to active sales.
      const { carts } = await CartRepository.validateAvailability(serverCarts);
      req.cart = CartRepository.validateCartItems(clientCarts, carts);
      next();
    } catch (error) {
      console.log('error:', error)
      return res.status(BAD_REQUEST).json({
        code: BAD_REQUEST,
        message: error.message || 'INVALID_CART_ITEMS',
        data: error.data || null,
      });
    }
  },
);

export const getOrderOwner = wrap(
  async (
    req: Request & {
      isVisitor: boolean;
      orderOwner: IAccountModel;
      session: { orderOwnerId: string };
    },
    res: Response,
    next: NextFunction,
  ) => {
    let ipAddress: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ipAddress.substr(0, 7) === '::ffff:') {
      ipAddress = ipAddress.substr(7);
    }

    if (req.user) {
      req.orderOwner = <IAccountModel>req.user;
      req.orderOwner.ipAddress = ipAddress;
      return next();
    }

    return res.status(BAD_REQUEST).json({
      code: BAD_REQUEST,
      message: 'USER_CART_NOT_FOUND',
    });
  },
);
