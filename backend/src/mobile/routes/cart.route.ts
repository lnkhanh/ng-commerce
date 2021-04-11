import { Router } from "express";
import { userAuth } from "@frontsite/middleware/auth";
import {
  getCart,
  addItem,
  removeItem,
  updateItem,
} from "@frontsite/controllers/cart.controller";
import { loadCart, locateCartItem } from "@frontsite/middleware/cart";

export const cartRouter = Router();

cartRouter.get("/", userAuth, loadCart, getCart);
cartRouter.post("/", userAuth, loadCart, addItem);
cartRouter.put(
  "/:cartItemId",
  userAuth,
  loadCart,
  locateCartItem,
  updateItem
);
cartRouter.delete(
  "/:cartItemId",
  userAuth,
  loadCart,
  locateCartItem,
  removeItem
);
