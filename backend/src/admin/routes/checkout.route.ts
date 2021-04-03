import { Router } from "express";

import { isUser } from "../middleware/account.middleware";
import { checkout, getCheckoutData } from "../controllers/checkout.controller";

import {
  validateCart,
  validateRequiredData,
  getOrderOwner,
} from "../middleware/checkout.middleware";

const checkoutStages = [
  validateRequiredData,
  validateCart,
  getOrderOwner,
  checkout,
];

export const checkoutAdminRouter = Router();

checkoutAdminRouter.get("/", isUser, getCheckoutData);
checkoutAdminRouter.post("/", isUser, ...checkoutStages);
