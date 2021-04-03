import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, UNAUTHORIZED } from 'http-status-codes';
import jwt from "jsonwebtoken";
import config from "config";
import { UserRepository } from '@src/repositories/user.repository';
import { wrap } from '@src/server';
import { IAccountModel } from '@src/types/account.type';
import Payload from "@src/frontsite/types/payload";

export const getOrderOwner = wrap(
  async (
    req: Request & {
      orderOwner: IAccountModel;
      userId: string;
    },
    res: Response,
    next: NextFunction,
  ) => {
    // Get token from header
    const token = req.header("authorization");

    // Check if no token
    if (!token) {
      return res
        .status(UNAUTHORIZED)
        .json({ msg: "No token, authorization denied" });
    }
    // Verify token
    try {
      const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
      req.user = await UserRepository.getUser(payload.userId);
      req.userId = payload.userId;
    } catch (err) {
      res
        .status(UNAUTHORIZED)
        .json({ msg: "Token is not valid" });
    }
    const user = <IAccountModel>req.user;

    if (req.user) {
      const ipAddress: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      req.orderOwner = {...user};
      req.orderOwner.ipAddress = ipAddress;

      req.body.customerId = user.id;
      req.body.email = user.email;
      req.body.firstName = user.firstName;
      req.body.lastName = user.lastName;

      return next();
    }

    return res.status(BAD_REQUEST).json({
      code: BAD_REQUEST,
      message: 'USER_CART_NOT_FOUND',
    });
  },
);
