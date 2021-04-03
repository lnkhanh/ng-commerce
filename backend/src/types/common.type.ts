import { Document, PaginateModel } from "mongoose";

export interface IResponseData {
	status: string;
	message?: string;
  data?: any;
}

export enum ResponseStatus {
  SUCCESS = "success",
  FAILED = "failed",
}

export type IDBBackup<T extends Document> = PaginateModel<T>;
export interface IDBBackupModel extends Document {
  id?: string;
  fileName: string;
  canRemove: boolean;
  status: boolean;
  createdAt: string;
}