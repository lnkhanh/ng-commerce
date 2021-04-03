import { Router } from "express";

import {
  getStores,
  getAllStores,
  addStore,
  getStore,
  updateStore,
  removeStore,
} from "../controllers/store.controller";
import { isUser } from "../middleware/account.middleware";

export const storeAdminRouter = Router();

storeAdminRouter.get("/", isUser, getStores);
storeAdminRouter.get("/pos/all", isUser, getAllStores);
storeAdminRouter.get("/:id", isUser, getStore);
storeAdminRouter.post("/", isUser, addStore);
storeAdminRouter.put("/:id", isUser, updateStore);
storeAdminRouter.delete("/:id", isUser, removeStore);
