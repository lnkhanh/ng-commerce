import { Router } from "express";

import {
  getStoreTables,
  getAllStoreTables,
  addStoreTable,
  updateStoreTable,
  removeStoreTable,
} from "../controllers/store.controller";
import { isUser } from "../middleware/account.middleware";

export const storeTableAdminRouter = Router();

storeTableAdminRouter.get("/:storeId", isUser, getStoreTables);
storeTableAdminRouter.get("/pos/:storeId", isUser, getAllStoreTables);
storeTableAdminRouter.post("/", isUser, addStoreTable);
storeTableAdminRouter.put("/:id", isUser, updateStoreTable);
storeTableAdminRouter.delete("/:id", isUser, removeStoreTable);
