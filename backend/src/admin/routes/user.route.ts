import { Router } from "express";

import {
  getUsers,
  newUser,
  getUser,
  updateUser,
  removeUser,
  changePassword,
  saveUploadAvatar,
  removeUserAvatar
} from "../controllers/user.controller";
import { isUser, createUser } from "../middleware/account.middleware";
import { uploadAvatarHandler } from "@src/middleware/upload-multer.middleware";

export const userAdminRouter = Router();

userAdminRouter.get("/:id", isUser, getUser);
userAdminRouter.get("/:pageIndex?", isUser, getUsers);
userAdminRouter.post("/", isUser, createUser, newUser);
userAdminRouter.post("/sign-up-default-user", createUser, newUser);
userAdminRouter.put("/:id", isUser, updateUser);
userAdminRouter.post("/change-password/:id", isUser, changePassword);
userAdminRouter.delete("/:id", isUser, removeUser);
userAdminRouter.post(
  "/upload/avatar/:userId",
  isUser,
  uploadAvatarHandler.array("photo"),
  saveUploadAvatar
);
userAdminRouter.get("/remove-avatar/:userId", isUser, removeUserAvatar);