import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "http-status-codes";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { wrap } from "@src/server";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { IResponseData, ResponseStatus } from "@src/types/common.type";
import { OrderRepository } from "@src/repositories/order.repository";

export const orderDetails = wrap(
  async (req: ISessionRequest, res: Response) => {
    if (!req.user) {
      return res.status(UNAUTHORIZED).json(<IResponseData>{
        status: ResponseStatus.FAILED,
        message: "Invalid request.",
      });
    }

    const order = await OrderRepository.getOrderDetails(
      req.user.id,
      req.params.orderId || req.params.orderCode
    );

    if (!order) {
      return res.status(BAD_REQUEST).json(<IResponseData>{
        status: ResponseStatus.FAILED,
        message: "Order not found.",
      });
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: order,
    };

    res.status(OK).json(data);
  }
);

export const getOrders = wrap(
  async (req: ISessionRequest, res: Response) => {
    const { pageIndex, pageSize, keyword } = req.query;

    try {
      const result = await OrderRepository.getOrders(+pageIndex, +pageSize, keyword);

      if (!result) {
        throw new Error();
      }

      const data: IResponseData = {
        status: ResponseStatus.SUCCESS,
        data: result
      };

      return res.status(OK).send(data);
    } catch (e) {
      console.log(e);
      const data: IResponseData = {
        status: ResponseStatus.FAILED,
        message: "NO_RECORDS_FOUND",
      };

      return res.status(BAD_REQUEST).json(data);
    }
  }
);

export const getOrdersInDay = wrap(
  async (req: ISessionRequest, res: Response) => {
    const { pageIndex, pageSize } = req.query;

    try {
      const result = await OrderRepository.getOrdersInDay(+pageIndex, +pageSize);

      if (!result) {
        throw new Error();
      }

      const data: IResponseData = {
        status: ResponseStatus.SUCCESS,
        data: result
      };

      return res.status(OK).send(data);
    } catch (e) {
      console.log(e);
      const data: IResponseData = {
        status: ResponseStatus.FAILED,
        message: "NO_RECORDS_FOUND",
      };

      return res.status(BAD_REQUEST).json(data);
    }
  }
);

export const changeOrderStatus = wrap(async (req: ISessionRequest, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    if (!orderId || status === undefined) {
      throw new Error("ORDER_NOT_FOUND");
    }

    const isUpdated = await OrderRepository.updateOrderStatus(
      Types.ObjectId(orderId),
      status
    );

    if (!isUpdated) {
      throw new Error("ORDER_NOT_FOUND");
    }

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
    };

    return res.status(OK).send(rsData);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "SOMETHING_WENT_WRONG",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

export const archiveOrder = wrap(async (req: ISessionRequest, res: Response) => {
  const { orderId } = req.params;

  try {
    if (!orderId) {
      throw new Error("ORDER_NOT_FOUND");
    }

    const isArchived = await OrderRepository.archiveOrder(
      Types.ObjectId(orderId)
    );

    if (!isArchived) {
      throw new Error("ORDER_NOT_FOUND");
    }

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
    };

    return res.status(OK).send(rsData);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "SOMETHING_WENT_WRONG",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

// For user
export const userOrderSummary = wrap(
  async (req: ISessionRequest, res: Response) => {
    const { user } = req;
    const orders = await OrderRepository.getOrderSummaryForUser(user.id);

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: orders,
    };

    res.status(OK).json(data);
  }
);
export const updateOrderItem = wrap(
  async (
    req: Request,
    res: Response
  ) => {
    const { quantity, note } = req.body;
    const { orderId, itemId } = req.params;

    try {
      if (!orderId || !itemId) {
        throw new Error();
      }

      if (quantity <= 0) {
        return removeOrderItem(req, res);
      }

      const order = await OrderRepository.updateOrderItemQuantity(
        orderId,
        itemId,
        quantity,
        note
      );
      const data: IResponseData = {
        status: ResponseStatus.SUCCESS,
        data: order,
      };

      return res.status(OK).json(data);
    } catch (error) {
      console.log(error);
      return res.status(INTERNAL_SERVER_ERROR).json({
        code: INTERNAL_SERVER_ERROR,
        message: "COULD_NOT_UPDATE_ITEM_QUANTITY",
      });
    }
  }
);

export const removeOrderItem = wrap(
  async (
    req: Request,
    res: Response
  ) => {
    let removed;
    const { orderId, itemId } = req.params;

    try {
      if (!orderId || !itemId) {
        throw new Error();
      }

      removed = await OrderRepository.removeOrderItem(orderId, itemId);

      const data: IResponseData = {
        status: ResponseStatus.SUCCESS,
        data: removed,
      };

      return res.status(OK).json(data);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        code: INTERNAL_SERVER_ERROR,
        message: "SOMETHING_WENT_WRONG_WHILE_REMOVING_THE_ITEM_FROM_THE_CART",
      });
    }
  }
);
