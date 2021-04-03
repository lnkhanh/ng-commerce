import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Types } from "mongoose";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { wrap } from "@src/server";
import { UserRepository } from "@src/repositories/user.repository";
import { AccountRepository } from "@src/repositories/account.repository";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { IUserModel } from "@src/types/user.type";
import { ISignUpRequest } from "@src/types/account/signup-request.type";
import { IAccountModel } from "@src/types/account.type";
import { IResponseData, ResponseStatus } from "@src/types/common.type";
import { PermissionEnum } from '@src/models/User';

export const getCustomers = wrap(async (req: ISessionRequest, res: Response) => {
  const { pageIndex, pageSize, keyword } = req.query;
  const roles = [PermissionEnum.CustomerUser];

  try {
    const result = await UserRepository.getUsers(+pageIndex, +pageSize, roles, keyword);
    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result,
    };

    return res.status(OK).json(rsData);
  } catch (e) {
    const rsData: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "COULD_NOT_LOAD_USER",
    };

    return res.status(BAD_REQUEST).json(rsData);
  }
});

export const newCustomer = wrap(async (req: ISignUpRequest, res: Response) => {
  let user: IAccountModel;

  // Validate email exists
  const existed = await AccountRepository.emailExisted(req.body.email);
  const data: IResponseData = {
    status: ResponseStatus.FAILED,
  };

  if (existed) {
    data.message = "EMAIL_ALREADY_EXISTS";
    return res.status(BAD_REQUEST).json(data);
  }

  try {
    user = await UserRepository.createLocalAccount(req.body);

    if (!user) {
      throw new Error("COULD_NOT_CREATE_NEW_USER");
    }

    data.status = ResponseStatus.SUCCESS;
    data.data = { user };

    res.status(CREATED).json(data);
  } catch (e) {
    data.message = "SOMETHING_WENT_WRONG";
    return res.status(BAD_REQUEST).json(data);
  }
});

export const getCustomer = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new Error();
    }

    const user = await UserRepository.getUser(id);

    if (!user) {
      throw new Error();
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: {
        user,
      },
    };
    return res.status(OK).json(data);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "USER_NOT_FOUND",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

export const updateCustomer = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;
  const body: IUserModel = req.body;

  try {
    if (!id || !body) {
      throw new Error();
    }

    const user = await UserRepository.updateUser(Types.ObjectId(id), body);

    if (!user) {
      throw new Error();
    }

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { user },
    };

    return res.status(OK).json(rsData);
  } catch (err) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "USER_UPDATE_ERROR",
    };
    res.status(BAD_REQUEST).json(data);
  }
});

export const changePassword = wrap(
  async (req: ISessionRequest, res: Response) => {
    const { id } = req.params;
    const success = await UserRepository.changePassword(id, req.body.password);

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      message: "PASSWORD_CHANGED",
    };

    if (success) {
      return res.status(OK).json(rsData);
    }

    rsData.status = ResponseStatus.FAILED;
    rsData.message = "COULD_NOT_CHANGE_PASSWORD";

    res.status(BAD_REQUEST).json(rsData);
  }
);

export const removeCustomer = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;

  try {
    const user = await UserRepository.removeUser(Types.ObjectId(id + ""));

    if (user && !user.deletedCount) {
      throw new Error("USER_NOT_FOUND");
    }
    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
    };

    return res.status(OK).json(data);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "SOMETHING_WENT_ERROR",
    };
    return res.status(BAD_REQUEST).json(data);
  }
});

export const resetPassword = wrap(async (req: Request, res: Response) => {
  const result: {
    isChanged?: boolean;
    message?: string;
  } = await UserRepository.resetPassword(req.body.token, req.body.password);

  if (result.isChanged) {
    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      message: "PASSWORD_CHANGED_NEW_PASSWORD",
    };
    return res.status(OK).json(rsData);
  }

  const rsErrData: IResponseData = {
    status: ResponseStatus.FAILED,
    message: result.message,
  };
  return res.status(BAD_REQUEST).json(rsErrData);
});

export const getAvatar = wrap(async (req: ISessionRequest, res: Response) => {
  const fileName = req.params.avatar,
    userId = req.params.userId,
    filePath = `uploads/${userId}/${fileName}`;

  fs.exists(filePath, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.sendFile(path.resolve("assets/img/user.png"));
    }
  });
});
