import { Router } from "express";

import {
  getCompanies,
  addCompany,
  getCompany,
  updateCompany,
  removeCompany,
} from "../controllers/company.controller";
import { isUser } from "../middleware/account.middleware";

export const companyAdminRouter = Router();

companyAdminRouter.get("/", isUser, getCompanies);
companyAdminRouter.get("/:id", isUser, getCompany);
companyAdminRouter.post("/", isUser, addCompany);
companyAdminRouter.put("/:id", isUser, updateCompany);
companyAdminRouter.delete("/:id", isUser, removeCompany);
