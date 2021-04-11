import config from "config";
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import { check } from "express-validator/check";
import Payload from "@src/frontsite/types/payload";
import Request from "@src/frontsite/types/request";

const checkName = (value: string) => {
  if (!value || value.length < 2) return false;
  return true;
}

export const signUpValidator = [
  check("email", "Please include a valid email").isEmail(),
  check("firstName", "Please include a valid first name").custom(checkName),
  check("lastName", "Please include a valid last name").custom(checkName),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 })
];

export const updateProfileValidator = [
  check("firstName", "Please include a valid first name").custom(checkName),
  check("lastName", "Please include a valid last name").custom(checkName),
  check("gender", "Please include gender"),
  check(
    "phone",
    "Please enter your phone"
  )
];

export const signInValidator = [
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 })
];

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header("authorization");

  // Check if no token
  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "No token, authorization denied" });
  }
  // Verify token
  try {
    const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
    req.userId = payload.userId;
    next();
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "Token is not valid" });
  }
}
