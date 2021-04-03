import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  CREATED,
  UNAUTHORIZED,
} from "http-status-codes";
import { wrap } from "@src/server";
import { IUserModel } from "@src/types/user.type";
import { AccountRepository } from "@src/repositories/account.repository";
import { CompanyRepository } from "@src/repositories/company.repository";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { IAccountModel } from "@src/types/account.type";
import { ISignUpRequest } from "@src/types/account/signup-request.type";
import { Types } from "mongoose";
import { IResponseData, ResponseStatus } from "@src/types/common.type";

const validRedirectRegex = /^https?:\/\/([\w]+\.)?(pages.ng-commerce|ng-commerce|staging.ng-commerce|testing.ng-commerce|dev1.ng-commerce|dev2.ng-commerce|dev3.ng-commerce|rc1.ng-commerce)\.(io|vn|dev)(:\d+)?($|\/)/;

const REGISTER_PASSWORD_LENGTH = 7;

export const changePassword = wrap(
  async (req: ISessionRequest, res: Response) => {
    const success = await AccountRepository.changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    );

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      message: 'PASSWORD_CHANGED'
    };

    if (success) {
      return res.status(OK).json(rsData);
    }

    rsData.status = ResponseStatus.FAILED;
    rsData.message = 'COULD_NOT_CHANGE_PASSWORD';

    res.status(BAD_REQUEST).json(rsData);
  }
);

export const checkTokenValid = wrap(
  async (req: ISessionRequest, res: Response) => {
    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: true,
    };
    
    if (req.user) {
      return res.status(OK).json(rsData);
    }

    rsData.data = false;
    return res.status(OK).json(rsData);
  }
);

export const checkEmailExisted = wrap(
  async (req: ISessionRequest, res: Response) => {
    const existed = await AccountRepository.emailExisted(req.query.email);

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: existed ? false : true,
    };
    
    return res.status(OK).json(rsData);
  }
);

export const forgotPassword = wrap(async (req: Request, res: Response) => {
  const rsData: IResponseData = {
    status: ResponseStatus.FAILED,
  };

  if (!req.body.email) {
    rsData.message = 'NO_EMAIL_PROVIDED';
    return res.status(BAD_REQUEST).send(rsData);
  }

  const existed = await AccountRepository.emailExisted(req.body.email);
  if (!existed) {
    rsData.message = 'EMAIL_NOT_EXIST';
    return res.status(NOT_FOUND).json(rsData);
  }

  // Prevent facebook user wants to reset password
  if (existed.provider === "facebook") {
    rsData.message = 'COULD_NOT_RESET_OF_FACEBOOK_ACCOUNT';
    return res.status(NOT_FOUND).json(rsData);
  }

  try {
    await AccountRepository.doPasswordResetByEmail(req.body.email);
  } catch (e) {
    rsData.message = 'COULD_NOT_SEND_EMAIL';
    return res.status(BAD_REQUEST).json(rsData);
  }

  rsData.status = ResponseStatus.SUCCESS;
  rsData.message = 'RESET_LINK_HAS_BEEN_SENT';

  return res.status(OK).json(rsData);
});

export const getInfo = wrap(async (req: ISessionRequest, res: Response) => {
  let { id } = req.user; // Get for logged in user

  if (req.params.id) {
    // Get for visiting user
    id = req.params.id;
  }

  const rsData: IResponseData = {
    status: ResponseStatus.FAILED,
  };

  if (!id) {
    rsData.message = 'USER_NOT_FOUND';
    return res.status(BAD_REQUEST).json(rsData);
  }

  try {
    const user = await AccountRepository.loadUser(id);

    if (!user) {
      throw new Error("COULD_NOT_LOAD_USER");
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: {
        user
      },
    };

    return res.status(OK).json(data);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "COULD_NOT_LOAD_USER",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

export const getFacebookHandler = (passport: any) =>
  wrap(async (req: ISessionRequest, res: Response, next: NextFunction) => {
    if (
      req.headers.referer &&
      req.headers.referer.toString().match(validRedirectRegex)
    ) {
      const referer = req.headers.referer.toString();
      const checkReturn = referer.split("?redirect=");

      console.log("referer checkReturn", referer, checkReturn);

      if (checkReturn.length > 1) {
        req.flash("redirect", checkReturn[1].split("&")[0]);
      } else {
        req.flash("redirect", referer);
      }
    }
    passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
  });
  
export const getLoginHandler = (strategy: string, passport: any) => {
  return (req: ISessionRequest, res: Response, next: NextFunction) => {
    passport.authenticate(strategy, (err: any, user: any) => {
      const rsData: IResponseData = {
        status: ResponseStatus.FAILED,
      };

      if (err && err.message) {
        console.log("getLoginHandler error", err.message);

        // Fix for an account wants to loginbyFacebook but the email has already existed in the system
        if (strategy === "facebook") {
          return res.redirect(`/auth/signin?facebookMessage=${err.message}`);
        }

        rsData.message = err.message;
        return res.status(UNAUTHORIZED).json(rsData);
      }

      if (!user) {
        if (strategy === "facebook") {
          const query = req.query;
          const str = Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join("&");
          return res.redirect(`/auth/signin?${str}`);
        }

        rsData.message = "EMAIL_PASSWORD_INCORRECT";
        return res.status(UNAUTHORIZED).json(rsData);
      }

      if (user.state !== "confirmed") {
        rsData.message = "SHOULD_ACTIVE_YOUR_ACCOUNT";
        return res.status(BAD_REQUEST).json(rsData);
      }

      req.login(user, async () => {
        const redirectUrl = req.flash("redirect").pop();

        if (redirectUrl) {
          return res.redirect(redirectUrl);
        }

        if (strategy === "facebook") {
          return res.redirect("/");
        }

        // Update last login
        await AccountRepository.uploadUserLastLogin(user.id);

        rsData.status = ResponseStatus.SUCCESS;
        rsData.data = {
          user
        };

        res.status(OK).json(rsData);
      });
    })(req, res, next);
  };
};

export const resetPassword = wrap(async (req: Request, res: Response) => {
  const result: {
    isChanged?: boolean;
    message?: string;
  } = await AccountRepository.resetPassword(req.body.token, req.body.password);

  const rsData: IResponseData = {
    status: ResponseStatus.SUCCESS,
    message: 'PASSWORD_CHANGED_NEW_PASSWORD'
  };

  if (result.isChanged) {
    return res.status(OK).json(rsData);
  }

  rsData.status = ResponseStatus.FAILED
  rsData.message = result.message;

  return res.status(BAD_REQUEST).json(rsData);
});

export const signUp = wrap(async (req: ISignUpRequest, res: Response) => {
  let user: IAccountModel;
  const rsData: IResponseData = {
    status: ResponseStatus.FAILED,
  };

  // Validate email exists
  const existed = await AccountRepository.emailExisted(req.body.email);
  if (existed) {
    rsData.message = "EMAIL_ALREADY_EXISTS";
    return res.status(BAD_REQUEST).json(rsData);
  }

  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      gender,
      companyName,
      companyAddress,
    } = req.body;
    const userData: IAccountModel = {
      email,
      password,
      firstName,
      lastName,
      phone,
      gender,
      provider: "local",
    };
    user = await AccountRepository.createLocalAccount(userData);

    const companyData = {
      name: companyName,
      address: companyAddress,
      createdBy: Types.ObjectId(user.id),
    };
    const company = await CompanyRepository.addCompany(companyData);

    if (!company) {
      throw new Error(`COULD_NOT_CREATE_COMPANY.`);
    }
  } catch (e) {
    rsData.message = "COULD_NOT_CREATE_COMPANY";
    return res.status(INTERNAL_SERVER_ERROR).json(rsData);
  }

  req.login(user, async (err) => {
    if (err) {
      rsData.message = "COULD_NOT_LOG_IN_NEW_USER";
      return res.status(INTERNAL_SERVER_ERROR).json(rsData);
    }

    rsData.status = ResponseStatus.SUCCESS;
    rsData.data = {
      user
    };

    res.status(CREATED).json(rsData);
  });
});

export const createPasswordAndLogin = wrap(
  async (req: ISessionRequest, res: Response) => {
    if (req.isVisitor) {
      return res.status(UNAUTHORIZED).json({
        error: true,
        message: "Access denied.",
      });
    }

    let user: IAccountModel;

    try {
      user = await AccountRepository.loadUser(req.visitorId);
    } catch (e) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        error: INTERNAL_SERVER_ERROR,
        message: "COULD_NOT_LOAD_USER",
      });
    }

    if (!user || user.state !== "pending") {
      return res.status(BAD_REQUEST).json({
        error: BAD_REQUEST,
        message: "COULD_NOT_CREATE_PASSWORD",
      });
    }

    // Validate password length
    if (req.body.password.length < REGISTER_PASSWORD_LENGTH) {
      return res.status(BAD_REQUEST).json({
        error: BAD_REQUEST,
        message: "REGISTER_INVALID_PASSWORD",
      });
    }

    try {
      user = await AccountRepository.createPasswordForGuest(
        user.id,
        req.body.password
      );
    } catch (e) {
      return res.status(BAD_REQUEST).json({
        error: BAD_REQUEST,
        message: "COULD_NOT_CREATE_PASSWORD",
      });
    }

    // Auto login
    req.login(user, async () => {
      res.status(OK).json(user);
    });
  }
);

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

export const signOut = (req: Request, res: Response) => {
  req.logout();

  return res.status(OK).json({
    status: ResponseStatus.SUCCESS,
    message: "SIGNED_OUT_SUCCESSFUL",
  });
};

export const updateInfo = wrap(async (req: ISessionRequest, res: Response) => {
  const data: IUserModel = req.body;
  try {
    const user = await AccountRepository.updateAccountInfo(req.user.id, data);

    if (!user) {
      throw new Error("USER_UPDATE_ERROR");
    }
    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: user,
    };

    res.status(OK).json(rsData);
  } catch (err) {
    const rsData: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "USER_UPDATE_ERROR",
    };
    res.status(BAD_REQUEST).json(rsData);
  }
});
