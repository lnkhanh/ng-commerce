import { Response } from "express";
import { BAD_REQUEST, OK } from "http-status-codes";
import { Types } from "mongoose";
import { AccountRepository } from "@src/repositories/account.repository";
import { CartItemType } from "@src/types/cart-item.type";
import { IAccountModel } from "@src/types/account.type";
import { CartRepository } from "@src/repositories/cart.repository";
import { OrderRepository } from "@src/repositories/order.repository";
import { StoreRepository } from "@src/repositories/store.repository";
import { wrap } from "@src/server";
import { logger } from "@src/infrastructure/logger";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { IResponseData, ResponseStatus } from "@src/types/common.type";
import { CheckoutPayload } from '@src/types/checkout.type';

export const getCheckoutData = wrap(
  async (req: ISessionRequest, res: Response) => {
    let cart;
    const userId = req.user.id;

    try {
      cart = await CartRepository.getCart(userId);
    } catch (error) {
      return res.status(BAD_REQUEST).json(<IResponseData>{
        status: ResponseStatus.FAILED,
        message: "UNABLE_TO_LOAD_DATA_FOR_CHECKOUT",
      });
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: {
        cart,
      },
    };

    return res.status(OK).json(data);
  }
);

export type checkoutRequest = ISessionRequest & {
  cart: Array<CartItemType>;
  orderOwner: IAccountModel;
  session: { orderCode: string };
};

export const checkout = wrap(async (req: checkoutRequest, res: Response) => {
  const { storeId, note, tableName, phone, customerId, email, firstName, lastName, source } = req.body;

  const logData = {
    cart: req.cart.map((cart) => {
      return {
        id: cart.id.toString(),
        productId: cart.productId.toString(),
        title: cart.title,
        salePrice: cart.salePrice,
        retailPrice: cart.retailPrice,
        quantity: cart.quantity,
        storeId: cart.storeId,
        tableName: cart.tableName
      };
    }),
    user: {
      id: req.orderOwner.id.toString(),
      phone: req.orderOwner.phone,
      email: req.orderOwner.email,
      date: Date().toString(),
    },
    customer: {
      phone, email, firstName, lastName
    },
    storeId,
    tableName,
    note,
    source
  };
  logger.info(
    `Cart Items from ${req.orderOwner.email} - ${req.orderOwner.ipAddress} - ${req.body.method}`,
    logData
  );

  const code = await OrderRepository.generateCode();

  let result;

  try {
    const store = await StoreRepository.getStore(Types.ObjectId(storeId));

    if (!store) {
      throw new Error('NO_STORE_FOUND');
    }

    const payload: CheckoutPayload = {
      userId: req.orderOwner.id,
      storeId: store.id,
      storeName: store.name,
      tableName: tableName,
      address: req.body.address,
      products: req.cart,
      paymentMethod: req.body.method,
      orderCode: code,
      note, customerId, phone, email, firstName, lastName,
      source
    };

    const orderData = await OrderRepository.createOrder(payload);

    result = await OrderRepository.submitOrder(orderData);
  } catch (error) {
    logger.error("Error when split orders", error, req);
    return res.status(BAD_REQUEST).json(<IResponseData>{
      status: ResponseStatus.FAILED,
      message: error.message || "UNEXPECTED_ERROR",
    });
  }

  await AccountRepository.addOrderToAccount(
    Types.ObjectId(req.orderOwner.id),
    result.id
  );
  await CartRepository.destroyCart(req.orderOwner.id);

  req.session.orderCode = code;

  const data: IResponseData = {
    status: ResponseStatus.SUCCESS,
    data: {
      orderId: result.id,
      code,
    },
  };

  return res.status(OK).json(data);
});
