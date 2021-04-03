import { Response } from "express";
import { wrap } from "@src/server";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { Types } from "mongoose";
import { ProductRepository } from "@src/repositories/product.repository";
import { OK, CREATED, BAD_REQUEST } from "http-status-codes";
import { IResponseData, ResponseStatus } from "@src/types/common.type";
import { AddProductType } from '@src/types/product.type';

const getProducts = wrap(async (req: ISessionRequest, res: Response) => {
  const { pageIndex, pageSize, keyword } = req.query;

  try {
    const result = await ProductRepository.getProducts(+pageIndex, +pageSize, keyword);

    if (!result) {
      throw new Error();
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result,
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

const getAllProducts = wrap(async (req: ISessionRequest, res: Response) => {
  try {
    const result = await ProductRepository.getAllProducts();

    if (!result) {
      throw new Error();
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result,
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

const getProduct = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error();
    }

    const product = await ProductRepository.getProduct(id.toString());

    if (!product) {
      throw new Error();
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { product },
    };

    return res.status(OK).send(data);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "NO_RECORD_FOUND",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

const addProduct = wrap(async (req: ISessionRequest, res: Response) => {
  try {
    const { name, description, retailPrice, salePrice, storeId, categoryId } = req.body;
    const data: AddProductType = {
      name,
      description,
      retailPrice,
      salePrice,
      category: categoryId
    };

    if (storeId) {
      data.store = storeId;
    }

    const product = await ProductRepository.addProduct(data);

    if (!product) {
      throw new Error();
    }

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { product },
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

const updateProduct = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, retailPrice, salePrice, storeId, categoryId, optionSets, dimension } = req.body;
  try {
    if (!id) {
      throw new Error();
    }

    const product = await ProductRepository.editProduct({
      id: Types.ObjectId(id),
      name,
      description,
      retailPrice,
      salePrice,
      storeId,
      categoryId,
      optionSets,
      dimension
    });

    if (!product) {
      throw new Error();
    }

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { product },
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

const archiveProduct = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    const isArchived = await ProductRepository.archiveProduct(
      Types.ObjectId(id)
    );

    if (!isArchived) {
      throw new Error("PRODUCT_NOT_FOUND");
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

const saveUploadPhotos = wrap(async (req: ISessionRequest, res: Response) => {
  const { productId } = req.params;
  const files = req.files;

  try {
    const product = await ProductRepository.saveUploadPhotos(productId, files);
    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { product },
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

export { getProducts, getAllProducts, getProduct, addProduct, updateProduct, archiveProduct, saveUploadPhotos };
