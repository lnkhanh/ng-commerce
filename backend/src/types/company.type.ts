import { Document, PaginateModel, Types } from "mongoose";

export type ICompany<T extends Document> = PaginateModel<T>

export interface ICompanyModel extends Document {
	id?: string;
	name: string;
	address: string;
	createdBy: Types.ObjectId;
	modifiedAt?: string;
	createdAt?: string;
}
