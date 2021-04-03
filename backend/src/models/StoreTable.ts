import { Schema, Types, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { IStoreTableModel, IStoreTable } from "@src/types/store-table.type";

const storeTableSchema: Schema = new Schema({
  name: {
    type: String
  },
  storeId: {
    type: Types.ObjectId,
    ref: "Store"
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

storeTableSchema.plugin(mongoosePaginate);
const StoreTable: IStoreTable<IStoreTableModel> = model<IStoreTableModel>(
  "StoreTable",
  storeTableSchema
);

export default StoreTable;
