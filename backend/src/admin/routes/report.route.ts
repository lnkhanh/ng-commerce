import { Router } from "express";
import { isUser } from "../middleware/account.middleware";
import {
	getOrderRevenue,
	getTopSales
} from '@admin/controllers/report.controller';

export const reportAdminRouter = Router();

reportAdminRouter.get("/order/revenue", isUser, getOrderRevenue);
reportAdminRouter.get("/order/top-sales", isUser, getTopSales);