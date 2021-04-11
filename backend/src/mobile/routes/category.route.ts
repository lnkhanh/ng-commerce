import { Router } from "express";
import { getAllCategories } from "@frontsite/controllers/category.controller";

export const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);
