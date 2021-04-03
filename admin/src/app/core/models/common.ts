export interface IResponseData {
	status: string;
	message?: string;
	data?: ResponseData | any;
}

export interface ResponseData {
	totalItems: number;
	pages: number;
	page: number;
	itemPerPage: number;
	records: any;
}

export class RequestParamModel {
	pageIndex: number;
	pageSize?: number;
	keyword?: string;
}
export class PaginatorModel {
	pageSize: number;
	pageIndex: number;
	totalPage: number;
	totalRecord: number;

	constructor(data) {
		const { pageSize, pageIndex } = data;
		this.pageSize = pageSize;
		this.pageIndex = pageIndex;
	}
}

export enum ResponseStatus {
	SUCCESS = 'success',
	FAILED = 'failed',
}
