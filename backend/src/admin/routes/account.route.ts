import { Router } from "express";
import { Passport } from "passport";

import {
  changePassword,
  checkEmailExisted,
  createPasswordAndLogin,
  forgotPassword,
  getInfo,
  getFacebookHandler,
  getLoginHandler,
  resetPassword,
  signOut,
  signUp,
  updateInfo,
  getAvatar,
  checkTokenValid,
} from "../controllers/account.controller";
import {
  identifyVisitor,
  isConfirmedUser,
  isUser,
  isValidEmail,
} from "../middleware/account.middleware";
import { facebookStrategy } from "@admin/strategies/facebook.strategy";
import { localStrategy } from "@admin/strategies/local.strategy";
import { AccountRepository } from "@src/repositories/account.repository";

export const passport = new Passport();

passport.use(facebookStrategy);
passport.use(localStrategy);

passport.serializeUser((user: Account, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId: string, done) => {
  const user = await AccountRepository.loadUser(userId);

  done(null, user);
});

export const accountAdminRouter = Router();

accountAdminRouter.get("/", isUser, getInfo); // this endpoint returns data for user and guest
accountAdminRouter.get("/token", checkTokenValid); // this endpoint returns data for user and guest
accountAdminRouter.get("/user/:id", getInfo); // this endpoint returns data for user and guest

accountAdminRouter.get("/user/:userId/:avatar", getAvatar);
accountAdminRouter.put("/", isConfirmedUser, updateInfo);
accountAdminRouter.get("/sign-out", isUser, signOut);

accountAdminRouter.get("/facebook", getFacebookHandler(passport));
accountAdminRouter.get(
  "/facebook/callback",
  identifyVisitor,
  getLoginHandler("facebook", passport)
);

accountAdminRouter.post(
  "/sign-in",
  identifyVisitor,
  getLoginHandler("local", passport)
);
accountAdminRouter.post("/sign-up", identifyVisitor, isValidEmail, signUp);
accountAdminRouter.post("/forgot", isValidEmail, forgotPassword);
accountAdminRouter.post("/reset", resetPassword);
accountAdminRouter.post("/add-password", identifyVisitor, createPasswordAndLogin);
accountAdminRouter.put("/change-password", isConfirmedUser, changePassword);
accountAdminRouter.get("/email-exists", checkEmailExisted);
