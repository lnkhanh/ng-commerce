import { Router } from "express";
import { auth, login, updateProfile, userSignUp, saveUploadAvatar, removeUserAvatar, addWishList, removeWishList, getWishList, checkAddedToWishList } from "@frontsite/controllers/account.controller";
import { userAuth, signUpValidator, updateProfileValidator, signInValidator } from '@frontsite/middleware/auth';
import { uploadAvatarHandler } from "@src/middleware/upload-multer.middleware";

export const accountRouter = Router();

accountRouter.get("/auth", userAuth, auth);
accountRouter.post("/sign-in", signInValidator, login);
accountRouter.put("/", userAuth, updateProfileValidator, updateProfile);
accountRouter.post("/sign-up", signUpValidator, userSignUp);
accountRouter.post(
  "/upload/avatar",
  userAuth,
  uploadAvatarHandler.array("photo"),
  saveUploadAvatar
);
accountRouter.get("/remove-avatar", userAuth, removeUserAvatar);

// Wishlist
accountRouter.post("/wishlist", userAuth, addWishList);
accountRouter.delete("/wishlist/:id", userAuth, removeWishList);
accountRouter.get("/wishlist", userAuth, getWishList);
accountRouter.get("/wishlist/added/:productId", userAuth, checkAddedToWishList);
