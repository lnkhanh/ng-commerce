import { Router } from "express";

import {
  getCategories,
  addCategory,
  getCategory,
  updateCategory,
  removeCategory,
  getAllCategories,
} from "../controllers/category.controller";
import { isUser } from "../middleware/account.middleware";

export const categoryAdminRouter = Router();

categoryAdminRouter.get("/", isUser, getCategories);
categoryAdminRouter.get("/pos/all", isUser, getAllCategories);
categoryAdminRouter.get("/:id", isUser, getCategory);
categoryAdminRouter.post("/", isUser, addCategory);
categoryAdminRouter.put("/:id", isUser, updateCategory);
categoryAdminRouter.delete("/:id", isUser, removeCategory);
