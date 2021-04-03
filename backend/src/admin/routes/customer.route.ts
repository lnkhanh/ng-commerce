import { Router } from "express";

import {
  getCustomers,
  newCustomer,
  getCustomer,
  updateCustomer,
  removeCustomer,
  changePassword
} from "../controllers/customer.controller";
import { isUser, createCustomer } from "../middleware/account.middleware";

export const customerAdminRouter = Router();

customerAdminRouter.get("/:id", isUser, getCustomer);
customerAdminRouter.get("/:pageIndex?", isUser, getCustomers);
customerAdminRouter.post("/", isUser, createCustomer, newCustomer);
customerAdminRouter.put("/:id", isUser, updateCustomer);
customerAdminRouter.post("/change-password/:id", isUser, changePassword);
customerAdminRouter.delete("/:id", isUser, removeCustomer);
