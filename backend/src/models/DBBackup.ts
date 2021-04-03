import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import { IDBBackupModel, IDBBackup } from "@src/types/common.type";

const dbBackupSchema: Schema = new Schema({
  fileName: {
    type: String
  },
  canRemove: {
    type: Boolean,
    default: true
  },
  status: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

dbBackupSchema.plugin(mongoosePaginate);
const DBBackup: IDBBackup<IDBBackupModel> = model<IDBBackupModel>(
  "DBBackup",
  dbBackupSchema
);

export default DBBackup;
