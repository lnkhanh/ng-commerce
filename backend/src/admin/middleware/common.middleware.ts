import { NextFunction, Response } from 'express';
import { CartItemType } from '@src/types/cart-item.type';
import { wrap } from '@src/server';
import { ISessionRequest } from "@src/types/account/session-request.type";

/**
 * Validates that the cart is present and matches the cart data we have stored in the session.
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const restoreSampleData = wrap(
  async (
    req: ISessionRequest & { cart?: Array<CartItemType>; },
    res: Response,
    next: NextFunction,
  ) => {
    const DEFAULT_BACKUP_FILE_NAME = "backup_2021-02-33-17-02-42.gz";
    req.body.fileName = DEFAULT_BACKUP_FILE_NAME;
    next();
  },
);
