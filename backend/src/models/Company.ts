import { Schema, Types, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { ICompanyModel, ICompany } from "@src/types/company.type";

const companySchema: Schema = new Schema({
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String
  },
  address: {
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

companySchema.plugin(mongoosePaginate);
const Company: ICompany<ICompanyModel> = model<ICompanyModel>(
  "Company",
  companySchema
);

export default Company;
