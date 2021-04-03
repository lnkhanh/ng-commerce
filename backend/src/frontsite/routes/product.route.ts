import { Router } from "express";
import { searchProducts, getProduct } from "@frontsite/controllers/product.controller";

export const productRouter = Router();

productRouter.get("/:id", getProduct);
productRouter.get("/", searchProducts);
