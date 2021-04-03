import { Router } from "express";
import { checkout } from "../../admin/controllers/checkout.controller";
import {
	validateCart,
	validateRequiredData,
} from "../../admin/middleware/checkout.middleware";

import {
	getOrderOwner,
} from "../middleware/checkout.middleware";

const checkoutStages = [
	getOrderOwner,
	validateRequiredData,
	validateCart,
	checkout,
];

export const checkoutRouter = Router();

checkoutRouter.post("/", ...checkoutStages);
