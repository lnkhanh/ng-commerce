import remove from "lodash/remove";
import moment from "moment";
import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { CartItemType } from "@src/types/cart-item.type";
import {
  Order,
  CheckoutOrder,
  CreateOrder,
  OrderSummary,
  IOrderModel,
  IOrder,
  OrderStatuses,
} from "@src/types/order.type";

import {
  paymentFactory,
  generateOrderCode,
  transformOrderSummary,
} from "./order.transforms";
import { logger } from "@src/infrastructure/logger";
import { Functions } from "@src/utils/functions";
import { TransformData } from '@src/utils/transform-data';
import { CheckoutPayload } from '@src/types/checkout.type';

const MAX_QUANTITY = 5;
const LegacyOrder = <IOrder<IOrderModel>>mongoose.model("Order");

export class OrderRepository {
  public static async createOrder(payload: CheckoutPayload) {
    const orderObj: CreateOrder = {
      code: payload.orderCode,
      user: payload.userId,
      address: payload.address,
      products: payload.products,
      storeId: payload.storeId,
      storeName: payload.storeName,
      tableName: payload.tableName,
      note: payload.note,
      // Customer
      customerId: payload.customerId,
      phone: payload.phone,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.lastName,
      source: payload.source
    };

    return paymentFactory(orderObj, payload.paymentMethod, payload.metadata);
  }

  public static async getOrders(page = 1, perPage = 10, keyword: string, customerId?: string) {
    const paginateOptions = {
      sort: { createdDate: -1 },
      populate: "user",
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const conditions: { code?: { [key:string]: string }, customerId?: string } = {};

    if (keyword) {
      conditions.code = { $regex: `${keyword}`, $options: 'i' }
    }

    if (customerId) {
      conditions.customerId = customerId;
    }

    const categoryResult = await LegacyOrder.paginate(conditions, paginateOptions);

    if (!categoryResult) {
      return null;
    }

    const lastResults: any[] = [];

    categoryResult.docs.forEach((record: any) => {
      lastResults.push(
        Object.assign({}, transformOrderSummary(record._doc), {
          createdBy: TransformData.transformLegacyUser(record._doc.user),
        })
      );
    });

    return {
      totalItems: categoryResult.total,
      pages: Math.ceil(categoryResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
  }

  public static async getOrdersInDay(page = 1, perPage = 10) {
    const paginateOptions = {
      sort: { createdDate: -1 },
      populate: "user",
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const allowedStatuses = [OrderStatuses.New, OrderStatuses.Preparing, OrderStatuses.Shipping, OrderStatuses.Ready];
    const categoryResult = await LegacyOrder.paginate({
      status: { $in: allowedStatuses },
      createdDate: {
        $gte: moment().startOf('day').toDate(),
        $lte: moment().endOf('day').toDate(),
      },
      isDeleted: false,
    }, paginateOptions);

    if (!categoryResult) {
      return null;
    }

    const lastResults: any[] = [];

    categoryResult.docs.forEach((record: any) => {
      lastResults.push(
        Object.assign({}, transformOrderSummary(record._doc), {
          createdBy: TransformData.transformLegacyUser(record._doc.user),
        })
      );
    });

    return {
      totalItems: categoryResult.total,
      pages: Math.ceil(categoryResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
  }

  // For user
  public static async getOrderSummaryForUser(
    userId: string
  ): Promise<Array<OrderSummary>> {
    const orders = await LegacyOrder.find({
      user: userId,
      status: { $nin: [OrderStatuses.Failed] },
    })
      .sort("-createdDate")
      .exec();

    return orders.map(transformOrderSummary);
  }

  public static async getUserByOrderCode(code: string) {
    const order = await LegacyOrder.findOne({ code }).exec();

    if (!order) {
      throw new Error("ORDER_DOES_NOT_EXIST");
    }
    return order.user;
  }

  public static async getOrderDetails(
    userId: string,
    orderId: string
  ): Promise<Order | Array<Order> | boolean> {
    let query;

    if (orderId.length < 24) {
      query = {
        code: {
          $regex: `(?>w+-)?${orderId}(?>-d+)?`,
        },
      };
    } else {
      query = { _id: Types.ObjectId(orderId) };
    }

    const orders = await LegacyOrder.find(query)
      .populate("products.product")
      .populate("user")
      .exec();

    if (!orders || !orders.length) {
      return false;
    }

    if (orders.length === 1) {
      const order = orders.pop();

      return await transformOrder(order);
    }

    return await Promise.all(orders.map((order) => transformOrder(order)));
  }

  public static async getOrderForCheckout(orderId: string): Promise<CheckoutOrder> {
    const order = await LegacyOrder.findById(orderId)
      .populate("user", "email")
      .populate("products.product")
      .exec();
    if (!order) {
      throw new Error("ORDER_DOES_NOT_EXIST");
    }

    return await transformOrderForCheckout(order);
  }

  public static async generateCode(): Promise<string> {
    const date = new Date();
    let code;

    do {
      code = generateOrderCode(date);
      logger.info("orders generateCode", code);
    } while ((await LegacyOrder.count({ code }).exec()) > 0);

    return code;
  }

  public static async submitOrder(orderData: CreateOrder): Promise<IOrderModel> {
    logger.info("Submitting new Order", orderData);
    const order = await LegacyOrder.create(orderData);
    logger.info("Saved order", order);

    return order;
  }

  public static async updateOrderStatus(orderId: Types.ObjectId, status: number): Promise<boolean> {
    const order = await LegacyOrder.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          status,
        },
      },
      { new: true }
    ).exec();

    if (!order) {
      return false;
    }

    return true;
  }

  public static async archiveOrder(orderId: Types.ObjectId): Promise<boolean> {
    const order = await LegacyOrder.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    ).exec();

    if (!order || order.isDeleted === false) {
      return false;
    }

    return true;
  }


  /**
   * @param itemId
   * @param quantity
   */
  public static async updateOrderItemQuantity(
    orderId: string,
    itemId: string,
    quantity: number,
    note: string
  ): Promise<OrderSummary & { products: CartItemType[] }> {
    if (quantity > MAX_QUANTITY) {
      throw new Error("ALREADY_REACHED_MAX_QUANTITY");
    }

    const order: IOrderModel = await LegacyOrder.findOne({
      _id: orderId,
    }).exec();

    if (!order || !order.products) {
      throw new Error("ORDER_NOT_FOUND");
    }

    order.products = order.products.map((product) => {
      if (`${product.productId}` === `${itemId}`) {
        product.quantity = quantity;

        if (note) {
          product.note = note;
        }
      }
      return product;
    });

    const result = transformOrderSummary(order);

    // Update nested object
    order.markModified('products');
    await order.save();
    return {
      ...result,
      products: order.products
    };
  }

  public static async removeOrderItem(orderId: string, productId: string): Promise<OrderSummary & { products: CartItemType[] }> {
    const order = await LegacyOrder.findOne({
      _id: orderId,
    }).exec();

    remove(order.products, (product) => {
      console.log(`${product.productId} ${productId}:`, `${product.productId}` === `${productId}`);
      return `${product.productId}` === `${productId}`;
    });
    const result = transformOrderSummary(order);

    // Remove order
    if (order.products.length === 0) {
      await LegacyOrder.findOne({
        _id: orderId,
      }).remove().exec();

      return {
        ...result,
        products: []
      }
    }

    // Update nested object
    order.markModified('products');
    await order.save();
    return {
      ...result,
      products: order.products
    };
  }
}

const transformOrderForCheckout = async (
  order: IOrderModel
): Promise<CheckoutOrder> => {
  const { code, address, products } = order;

  return {
    id: order._id.toString(),
    code,
    user: TransformData.transformLegacyUser(order.user),
    products,
    address: address,
  };
};

const transformOrder = async (order: IOrderModel): Promise<Order> => {
  const orderList = await OrderRepository.getOrderSummaryForUser(order.user._id.toString());

  return {
    id: order._id.toString(),
    code: order.code,
    user: TransformData.transformLegacyUser(order.user),
    customer: {
      id: order.customerId,
      firstName: order.firstName,
      lastName: order.lastName,
      phone: order.phone,
      email: order.email
    },
    address: order.address,
    status: order.status,
    products: order.products,
    createdDate: moment(order.createdDate).format("DD/MM/YYYY hh:mm A"),
    createdTimestamp: moment(order.createdDate).unix(),
    displayMessage: order.displayMessage,
    note: order.note,
    source: order.source,
    isFirstOrder:
      orderList.length === 1 &&
      orderList.findIndex(
        (item) => item.id.toString() === order._id.toString()
      ) === 0,
    ...Functions.calculateCartSummary(order.products)
  };
};
