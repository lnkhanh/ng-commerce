import { Response } from "express";
import { wrap } from "@src/server";
import { ProductRepository } from "@src/repositories/product.repository";
import { CategoryRepository } from "@src/repositories/category.repository";
import { OK, BAD_REQUEST } from "http-status-codes";
import { IResponseData, ResponseStatus } from "@src/types/common.type";
import Request from "@src/frontsite/types/Request";

export const searchProducts = wrap(async (req: Request, res: Response) => {
	const { pageIndex, pageSize, keyword, catSlug } = req.query;

	try {
    let catId = '';

    // Filter by category
    if (catSlug) {
      const cat = await CategoryRepository.getCategoryBySlug(<string>catSlug);
      if (cat) {
        catId = cat.id;
      }
    }

		const result = await ProductRepository.getProducts(+pageIndex, +pageSize, <string>keyword, catId);

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

export const getProduct = wrap(async (req: Request, res: Response) => {
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
      data: product,
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