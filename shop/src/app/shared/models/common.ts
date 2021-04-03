export interface ResponseData {
	totalItems: number;
	pages: number;
	page: number;
	itemPerPage: number;
	records: any;
}

export interface IResponseData {
	status: string;
	message?: string;
	data?: ResponseData | any;
}

export class RequestParamModel {
	pageSize: number;
	pageIndex?: number;
	keyword?: string;
}

export enum ResponseStatus {
	SUCCESS = 'success',
	FAILED = 'failed',
}

export class PaginatorModel {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;

  constructor(data) {
    const { pageSize, pageIndex } = data;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  }
}