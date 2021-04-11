import { Router } from "express";
import { getOrders, orderDetails } from "@frontsite/controllers/order.controller";
import { userAuth } from '@frontsite/middleware/auth';


export const orderRouter = Router();

orderRouter.get("/:orderCode", userAuth, orderDetails);
orderRouter.get("/", userAuth, getOrders);
