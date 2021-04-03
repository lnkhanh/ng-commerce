import { Response } from "express";
import { wrap } from "@src/server";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { OptionSetRepository } from "@src/repositories/option-set.repository";
import { OK, CREATED, BAD_REQUEST } from "http-status-codes";
import { IResponseData, ResponseStatus } from "@src/types/common.type";

const getOptionSets = wrap(async (req: ISessionRequest, res: Response) => {
	const { pageIndex, pageSize, keyword } = req.query;

	try {
		const result = await OptionSetRepository.getOptionSets(+pageIndex, +pageSize, keyword);

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

const getOptionSet = wrap(async (req: ISessionRequest, res: Response) => {
	const { id } = req.params;
	try {
		if (!id) {
			throw new Error("NO_RECORDS_FOUND");
		}

		const optionSet = await OptionSetRepository.getOptionSet(id);

		if (!optionSet) {
			throw new Error("NO_RECORDS_FOUND");
		}

		const data: IResponseData = {
			status: ResponseStatus.SUCCESS,
			data: optionSet,
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

const addOptionSet = wrap(async (req: ISessionRequest, res: Response) => {
	try {
		if (!req.body) {
			throw new Error();
		}
		const result = await OptionSetRepository.addOptionSet(req.body);

		if (!result) {
			throw new Error();
		}

		const data: IResponseData = {
			status: ResponseStatus.SUCCESS,
			data: result,
		};

		return res.status(CREATED).send(data);
	} catch (e) {
		console.log(e);
		const data: IResponseData = {
			status: ResponseStatus.FAILED,
			message: "NO_OPTION_SETS_FOUND",
		};

		return res.status(BAD_REQUEST).json(data);
	}
});

const updateOptionSet = wrap(async (req: ISessionRequest, res: Response) => {
	try {
		if (!req.body) {
			throw new Error();
		}

		const result = await OptionSetRepository.editOptionSet(req.body);

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
			message: "NO_OPTION_SETS_FOUND",
		};

		return res.status(BAD_REQUEST).json(data);
	}
});

const removeOptionSet = wrap(async (req: ISessionRequest, res: Response) => {
	const { optionSetId } = req.params;

	try {
		if (!req.body) {
			throw new Error();
		}

		const result = await OptionSetRepository.removeOptionSet(optionSetId);

		if (!result) {
			throw new Error();
		}

		const data: IResponseData = {
			status: ResponseStatus.SUCCESS
		};

		return res.status(OK).send(data);
	} catch (e) {
		const data: IResponseData = {
			status: ResponseStatus.FAILED,
			message: "NO_OPTION_SETS_FOUND",
		};

		return res.status(BAD_REQUEST).json(data);
	}
});

export { getOptionSets, getOptionSet, addOptionSet, updateOptionSet, removeOptionSet };
