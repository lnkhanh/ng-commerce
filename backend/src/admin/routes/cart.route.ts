import { Router } from "express";

import { identifyVisitor } from "@admin/middleware/account.middleware";
import {
	getCart,
  addItem,
  removeCartItems,
  removeItem,
  updateItem,
} from "@admin/controllers/cart.controller";
import { loadCart, locateCartItem } from "@admin/middleware/cart.middleware";

export const cartAdminRouter = Router();

cartAdminRouter.get("/", identifyVisitor, loadCart, getCart);
cartAdminRouter.post("/", identifyVisitor, loadCart, addItem);
cartAdminRouter.put("/delete-multiple", identifyVisitor, loadCart, removeCartItems);
cartAdminRouter.put(
  "/:cartItemId",
  identifyVisitor,
  loadCart,
  locateCartItem,
  updateItem
);
cartAdminRouter.delete(
  "/:cartItemId",
  identifyVisitor,
  loadCart,
  locateCartItem,
  removeItem
);
