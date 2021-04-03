import { uploadProductPhotosHandler } from '@admin/middleware/product.middleware';
import { Router } from "express";

import {
  getProducts,
  getAllProducts,
  addProduct,
  getProduct,
  updateProduct,
  archiveProduct,
  saveUploadPhotos
} from "../controllers/product.controller";
import { isUser } from "../middleware/account.middleware";

export const productAdminRouter = Router();

productAdminRouter.get("/", isUser, getProducts);
productAdminRouter.get("/pos/all", isUser, getAllProducts);
productAdminRouter.get("/:id", isUser, getProduct);
productAdminRouter.post("/", isUser, addProduct);
productAdminRouter.put("/:id", updateProduct);
productAdminRouter.delete("/:id", isUser, archiveProduct);

productAdminRouter.post(
  "/upload/photos/:productId",
  isUser,
  uploadProductPhotosHandler.array("photo"),
  saveUploadPhotos
);