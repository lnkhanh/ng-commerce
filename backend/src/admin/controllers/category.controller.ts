import { Response } from "express";
import { wrap } from "@src/server";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { Types } from "mongoose";
import { CategoryRepository } from "@src/repositories/category.repository";
import { OK, CREATED, BAD_REQUEST } from "http-status-codes";
import { IResponseData, ResponseStatus } from "@src/types/common.type";

const getCategories = wrap(async (req: ISessionRequest, res: Response) => {
  const { pageIndex, pageSize, keyword } = req.query;

  try {
    const result = await CategoryRepository.getCategories(+pageIndex, +pageSize, keyword);

    if (!result) {
      throw new Error();
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result
    };

    return res.status(OK).send(data);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "NO_RECORDS_FOUND",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

const getAllCategories = wrap(async (req: ISessionRequest, res: Response) => {
  try {
    const result = await CategoryRepository.getAllCategories();

    if (!result) {
      throw new Error();
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result
    };

    return res.status(OK).send(data);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "NO_RECORDS_FOUND",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

const getCategory = wrap(async (req: ISessionRequest, res: Response) => {
  const categoryId = req.params.id;
  try {
    const category = await CategoryRepository.getCategory(
      Types.ObjectId(categoryId + "")
    );

    if (!category) {
      throw new Error("CATEGORY_NOT_EXIST");
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { category },
    };

    return res.status(OK).send(data);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "CATEGORY_NOT_EXIST",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

const addCategory = wrap(async (req: ISessionRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const { name } = req.body;

    const data = {
      name,
      createdBy: Types.ObjectId(userId),
    };
    const category = await CategoryRepository.addCategory(data);

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { category },
    };

    return res.status(CREATED).send(rsData);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "SOMETHING_WENT_WRONG",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

const updateCategory = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!id) {
      throw new Error();
    }

    const category = await CategoryRepository.editCategory(
      Types.ObjectId(id),
      name,
    );

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { category },
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

const removeCategory = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new Error("CATEGORY_NOT_FOUND");
    }

    const category = await CategoryRepository.removeCategory(Types.ObjectId(id));

    if (!category) {
      throw new Error("CATEGORY_NOT_FOUND");
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

export { getCategories, getAllCategories, getCategory, addCategory, updateCategory, removeCategory };
