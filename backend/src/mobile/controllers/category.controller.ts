import { Response } from "express";
import { wrap } from "@src/server";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { CategoryRepository } from "@src/repositories/category.repository";
import { OK, BAD_REQUEST } from "http-status-codes";
import { IResponseData, ResponseStatus } from "@src/types/common.type";

export const getAllCategories = wrap(async (req: ISessionRequest, res: Response) => {
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
