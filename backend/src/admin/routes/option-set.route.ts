import { Router } from "express";
import {
  getOptionSets,
  getOptionSet,
  addOptionSet,
  updateOptionSet,
  removeOptionSet
} from "../controllers/option-set.controller";
import { isUser } from "../middleware/account.middleware";

export const optionSetAdminRouter = Router();

optionSetAdminRouter.get("/", isUser, getOptionSets);
optionSetAdminRouter.get("/:id", isUser, getOptionSet);
optionSetAdminRouter.post("/", isUser, addOptionSet);
optionSetAdminRouter.put("/:id", isUser, updateOptionSet);
optionSetAdminRouter.delete("/:optionSetId", isUser, removeOptionSet);