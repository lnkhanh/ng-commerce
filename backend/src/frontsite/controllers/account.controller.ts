import { wrap } from "@src/server";
import config from "config";
import { Response } from "express";
import * as mongoose from "mongoose";
import { validationResult } from "express-validator/check";
import HttpStatusCodes, { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import jwt from "jsonwebtoken";
import Payload from "@src/frontsite/types/Payload";
import Request from "@src/frontsite/types/Request";
import { IUserModel, IUser } from "@src/types/user.type";
import { UserRepository } from "@src/repositories/user.repository";
import { AccountRepository } from "@frontsite/repositories/account.repository";
import { IResponseData, ResponseStatus } from '@src/types/common.type';
import { TransformData } from '@src/utils/transform-data';

const LegacyUser = <IUser<IUserModel>>mongoose.model("User");

export const auth = wrap(async (req: Request, res: Response) => {
  try {
    const user = await AccountRepository.userExisted(req.userId);

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: user
    };

    res.json(rsData);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export const login = wrap(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await LegacyUser.findOne({ email }).exec();

    if (!user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "Invalid Credentials"
          }
        ]
      });
    }

    const isMatch = user.authenticate(password);

    if (!isMatch) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "Invalid Credentials"
          }
        ]
      });
    }

    const payload: Payload = {
      userId: user.id
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: config.get("jwtExpiration") },
      (err, token) => {
        if (err) throw err;
        const rsData: IResponseData = {
          status: ResponseStatus.SUCCESS,
          data: { token, user: TransformData.transformLegacyUser(user) }
        };
        res.json(rsData);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export const userSignUp = wrap(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;
  try {
    const userExists = await AccountRepository.emailExisted(email);

    if (userExists) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "User already exists"
          }
        ]
      });
    }

    const userFields = {
      firstName,
      lastName,
      email,
      password
    };

    const user = await AccountRepository.createLocalAccount(userFields);
    const payload: Payload = {
      userId: user.id
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: config.get("jwtExpiration") },
      (err, token) => {
        if (err) throw err;
        const rsData: IResponseData = {
          status: ResponseStatus.SUCCESS,
          data: { token, user }
        };
        res.json(rsData);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export const updateProfile = wrap(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  const { firstName, lastName, phone, gender, address } = req.body;

  const profileFields = {
    firstName,
    lastName,
    phone,
    gender,
    address
  };

  try {
    const user = await AccountRepository.updateAccountInfo(req.userId, profileFields);

    if (!user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "User not registered",
          },
        ],
      });
    }
    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: user
    };

    res.json(rsData);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});


export const saveUploadAvatar = wrap(async (req: Request & { files: any; }, res: Response) => {
  const userId = req.userId;
  const files = req.files;

  try {
    if (!files[0]) {
      throw new Error('File not found!');
    }

    const user = await UserRepository.saveUploadAvatar(userId, files[0]);
    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { user },
    };

    return res.status(OK).send(rsData);
  } catch (e) {
    console.log(e);
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "SOMETHING_WENT_WRONG",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

export const removeUserAvatar = wrap(async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await UserRepository.removeUserAvatar(userId);
    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { user },
    };

    return res.status(OK).send(rsData);
  } catch (e) {
    console.log(e);
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "SOMETHING_WENT_WRONG",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

export const getWishList = wrap(async (req: Request, res: Response) => {
  const { pageIndex, pageSize } = req.query;
  const userId = req.userId;

  try {
    const result = await AccountRepository.getWishList(+pageIndex, +pageSize, userId);

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result,
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

export const addWishList = wrap(async (req: Request, res: Response) => {
  const { productId } = req.body;
  const { userId } = req;

  try {
    const result = await AccountRepository.addWishList(userId, productId);

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result,
    };

    return res.status(CREATED).send(rsData);
  } catch (e) {
    console.log(e);
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "SOMETHING_WENT_WRONG",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

export const removeWishList = wrap(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new Error("ITEM_NOT_FOUND");
    }

    const item = await AccountRepository.removeWishList(id);

    if (!item) {
      throw new Error("ITEM_NOT_FOUND");
    }

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
    };

    return res.status(OK).send(rsData);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "ITEM_NOT_FOUND",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

export const checkAddedToWishList = wrap(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { userId } = req;

  try {
    const result = await AccountRepository.checkAddedWishList(userId, productId);

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result,
    };

    return res.status(OK).send(rsData);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: false,
    };

    return res.status(OK).json(data);
  }
});