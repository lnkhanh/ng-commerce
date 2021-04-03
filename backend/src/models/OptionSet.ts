import { IOptionSet, IOptionSetModel, OptionSetControlType } from '@src/types/option-set.type';
import { Schema, model } from 'mongoose';
import mongoosePaginate from "mongoose-paginate";

export const optionSetSchema = new Schema({
	name: {
		type: String,
		default: "",
		required: "Please fill Option Set name",
		trim: true,
	},
	displayName: {
		type: String,
		default: "",
		required: "Please fill Option Set display name",
		trim: true,
	},
	displayControlType: {
		type: OptionSetControlType,
		default: OptionSetControlType.INPUT,
		required: "Please fill display control type",
	},
	displayOrder: {
		type: Number
	},
	options: {
		type: String
	},
	modifiedAt: {
		type: Date,
		default: null,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

optionSetSchema.plugin(mongoosePaginate);
const OptionSet: IOptionSet<IOptionSetModel> = model<IOptionSetModel>(
	"OptionSet",
	optionSetSchema
);

export default OptionSet;