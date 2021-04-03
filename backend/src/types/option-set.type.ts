import { Document, PaginateModel, Types } from "mongoose";

export type IOptionSet<T extends Document> = PaginateModel<T>;

export interface IOptionSetModel extends Document {
	_id: Types.ObjectId;
	name: string;
	displayName: string;
	displayOrder?: number;
	displayControlType: string;
	options: string;
	modifiedAt?: string;
	createdAt?: string;
}

export enum OptionSetControlType {
	INPUT,
	CHECKBOX,
	RADIO,
	SELECT,
	LIST
}

export type OptionSet = {
	id?: string;
	name: string;
	displayName: string;
	displayOrder?: number;
	displayControlType: string;
	options: Option[];
	modifiedAt?: string;
	createdAt?: string;
}

export type Option = {
	name: string;
	displayName: string;
	value: number;
	displayOrder: number;
}