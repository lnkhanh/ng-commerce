import { Response } from "express";
import { wrap } from "@src/server";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { BAD_REQUEST, OK } from 'http-status-codes';
import { IResponseData, ResponseStatus } from '@src/types/common.type';
import { ReportRepository } from '@src/repositories/report.repository';

const getOrderRevenue = wrap(async (req: ISessionRequest, res: Response) => {
	const { storeId, start, end } = req.query;

	try {
      const result = await ReportRepository.getOrderRevenue(storeId, start, end);

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
});

const getTopSales = wrap(async (req: ISessionRequest, res: Response) => {
	const { storeId, start, end, pageSize } = req.query;

	try {
		const result = await ReportRepository.getTopSales(storeId, start, end, pageSize);

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
});

export {
	getOrderRevenue,
	getTopSales
};