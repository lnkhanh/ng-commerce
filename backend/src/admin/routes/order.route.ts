import { Router } from "express";

import {
  identifyVisitor,
  isConfirmedUser,
} from "@admin/middleware/account.middleware";
import { orderDetails, getOrders, getOrdersInDay, changeOrderStatus, updateOrderItem, archiveOrder } from "../controllers/order.controller";

export { OrderRepository } from "@src/repositories/order.repository";

export const ordersAdminRouter = Router();

ordersAdminRouter.get("/", isConfirmedUser, getOrders);
ordersAdminRouter.get("/pos/in-day", isConfirmedUser, getOrdersInDay);
ordersAdminRouter.get("/:orderId", identifyVisitor, orderDetails);
ordersAdminRouter.put("/order-status/:orderId", isConfirmedUser, changeOrderStatus);
ordersAdminRouter.delete("/:orderId", isConfirmedUser, archiveOrder);
ordersAdminRouter.put(
  "/:orderId/:itemId",
  isConfirmedUser,
  updateOrderItem
);