import { wrap } from "@src/server";
import { OrderRepository } from "@src/repositories/order.repository";
import { IResponseData, ResponseStatus } from "@src/types/common.type";
import { Response } from "express";
import { BAD_REQUEST, OK } from 'http-status-codes';
import Request from "@src/frontsite/types/Request";

export const getOrders = wrap(
	async (req: Request, res: Response) => {
		const { pageIndex, pageSize, keyword } = req.query;

		try {
			const result = await OrderRepository.getOrders(+pageIndex, +pageSize, <string>keyword, req.userId);

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

export const orderDetails = wrap(
	async (req: Request, res: Response) => {
		const order = await OrderRepository.getOrderDetails(
			req.userId,
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