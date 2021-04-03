import { CartItemType } from "@src/types/cart-item.type";
import moment from "moment";
import groupBy from "lodash/groupBy";
import { CreateOrder, IOrderModel, OrderSummary } from "@src/types/order.type";
import { OrderRevenueDataType, OrderRevenueItemType, TopProductSaleType } from '@src/types/report.type';

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

/**
 * This returns a closure around the PaymentOrder, later used to calculate things out.  The PaymentOptions returned
 * is a stateful object so should be moved to a class.
 * @param order
 * @param paymentMethod
 * @param metadata
 */
export const paymentFactory = (
  order: CreateOrder,
  paymentMethod: string,
  metadata?: any
) => {
  const itemTotal = order.products.reduce(
    (total: number, product: CartItemType) => total + product.retailPrice,
    0
  );

  order.paymentSummary = {
    method: paymentMethod,
    subtotal: itemTotal,
    total: itemTotal,
  };
  order.metadata = metadata;

  return order;
};

export const generateOrderCode = (date: Date) => {
  return (
    (+(date.getFullYear().toString().substr(2) + (date.getMonth() + 1)))
      .toString(16)
      .toUpperCase() +
    (+new Date() * Math.random())
      .toString(36)
      .replace(".", "")
      .substr(1, 5)
      .toUpperCase()
  );
};

export const transformOrderSummary = (order: IOrderModel): OrderSummary => {
  let summary = {
    total: 0,
    qty: 0
  };
  if (order.products) {
    summary = order.products.reduce((sum, product) => {
      return {
        total: sum.total + product.retailPrice,
        qty: sum.qty + product.quantity
      };
    }, {
      total: 0,
      qty: 0
    });
  }

  return {
  id: order._id.toString(),
  code: order.code,
  createdDate: moment(order.createdDate).format("DD/MM/YYYY hh:mm A"),
  displayMessage: order.displayMessage,
  status: order.status,
  storeId: order.storeId,
  storeName: order.storeName,
  tableName: order.tableName,
  note: order.note,
  customerId: order.customerId,
  phone: order.phone,
  firstName: order.firstName,
  lastName: order.lastName,
  email: order.email,
  ...summary
}};

export const transformOrderRevenueReport = (orders: IOrderModel[], startDate: string, endDate: string): OrderRevenueDataType => {
  const reportItems: OrderRevenueItemType[] = [];

  const totalRevenue = orders.reduce(
    (total: number, order: IOrderModel) => {
      const totalOrder = order.products.reduce(
        (orderTotal: number, product: CartItemType) => orderTotal + product.retailPrice,
        0
      );

      reportItems.push({
        TotalAmount: totalOrder,
        OrderDate: moment(order.createdDate).startOf('day').format(DATE_FORMAT),
        TotalOrder: order.products.length
      });

      return total + totalOrder
    }, 0
  );

  // Count num of ordered users
  const orderCustomerCount = Object.keys(groupBy(orders, 'customerId')).length;

  return {
    Data: reportItems,
    Revenue: totalRevenue,
    Users: orderCustomerCount,
    Start: moment(startDate).startOf('day').format(DATE_FORMAT),
    End: moment(endDate).startOf('day').format(DATE_FORMAT),
    TotalOrder: orders.length,
  };
}

export const transformProductSaleReport = (orders: IOrderModel[], top = 5): TopProductSaleType[] => {
  const flatProducts = orders.reduce((result, { products }) => result.concat(...products), []);
  const groupByProductId = groupBy(flatProducts, 'productId');
  const productIds = Object.keys(groupByProductId);
  const sumProducts: TopProductSaleType[] = [];
  productIds.forEach((productId) => {
    const products: CartItemType[] = groupByProductId[productId];

    if (products && products.length === 0) {
      return;
    }
    const { title, retailPrice } = products[0];
    const summary = products.reduce((sum, product) => {
      return {
        total: sum.total + product.retailPrice,
        qty: sum.qty + product.quantity
      };
    }, {
      total: 0,
      qty: 0
    });

    sumProducts.push({
      Price: retailPrice,
      ProductName: title,
      Quantity: summary.qty,
      Revenue: summary.total
    });
  });

  return sumProducts.sort((a, b) => (b.Revenue - a.Revenue)).splice(0, top);
};