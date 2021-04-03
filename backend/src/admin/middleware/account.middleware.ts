
import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST, UNAUTHORIZED } from "http-status-codes";
import { AccountRepository } from "@src/repositories/account.repository";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { PermissionEnum } from '@src/models/User';

export const createCustomer = (
  req: ISessionRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.body) {
    req.body.role = PermissionEnum.CustomerUser;
    return next();
  }

  res.status(BAD_REQUEST).json({
    error: true,
    message: "Invalid request.",
  });
};

export const createUser = (
  req: ISessionRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.body) {
    if (req.body.role === PermissionEnum.SystemUser || req.body.role === PermissionEnum.StaffUser) {
      return next();
    }
  }

  next();
};

export const identifyVisitor = (
  req: ISessionRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user) {
    req.visitorId = req.user.id;
    req.isVisitor = false;
  } else {
    req.visitorId = req.sessionID;
    req.isVisitor = true;
  }

  next();
};

export const isUser = (
  req: ISessionRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user) {
    return next();
  }

  res.status(UNAUTHORIZED).json({
    error: true,
    message: "Access denied.",
  });
};

export const isConfirmedUser = (
  req: ISessionRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.state === "confirmed") {
    return next();
  }

  res.status(UNAUTHORIZED).json({
    error: true,
    message: "Access denied.",
  });
};

export const isAdminUser = (
  req: ISessionRequest,
  res: Response,
  next: NextFunction
): void => {
  if (
    req.user &&
    req.user.state === "confirmed" &&
    req.user.role === "ROLE_ADMIN"
  ) {
    return next();
  }

  res.status(UNAUTHORIZED).json({
    error: true,
    message: "Access denied.",
  });
};

export const isGuest = (
  req: ISessionRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next();
  }

  res.status(UNAUTHORIZED).json({
    error: true,
    message: "Access denied.",
  });
};

export const isValidEmail = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (!req.body.email) {
    return res.status(BAD_REQUEST).json({
      code: BAD_REQUEST,
      message: "EMAIL_ADDRESS_REQUIRED",
    });
  }

  // tslint:disable-next-line:max-line-length
  if (!AccountRepository.isValidEmail(req.body.email)) {
    return res.status(BAD_REQUEST).json({
      code: BAD_REQUEST,
      message: "REGISTER_INVALID_EMAIL",
    });
  }

  return next();
};

