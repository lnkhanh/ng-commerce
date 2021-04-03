import { Schema, Types, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { IStoreModel, IStore } from "@src/types/store.type";

const storeSchema: Schema = new Schema({
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
  companyId: {
    type: Types.ObjectId,
    ref: "Company"
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

storeSchema.plugin(mongoosePaginate);
const Store: IStore<IStoreModel> = model<IStoreModel>(
  "Store",
  storeSchema
);

export default Store;
