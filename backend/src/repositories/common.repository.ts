import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { unlinkSync, existsSync } from "fs";
import { IDBBackup, IDBBackupModel } from "@src/types/common.type";
import { TransformData } from '@src/utils/transform-data';

const DBBackup = <IDBBackup<IDBBackupModel>>mongoose.model("DBBackup");

export class CommonRepository {
  public static async getBackups(page = 1, perPage = 10) {
    const paginateOptions = {
      sort: { createdAt: -1 },
      offset: (page - 1) * perPage,
      limit: perPage,
    };

    const bkResult = await DBBackup.paginate({}, paginateOptions);

    if (!bkResult) {
      return null;
    }

    const lastResults: any[] = [];

    bkResult.docs.forEach((record: any) => {
      lastResults.push(
        Object.assign({}, TransformData.transformBackupItem(record._doc))
      );
    });

    return {
      totalItems: bkResult.total,
      pages: Math.ceil(bkResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
  }

  public static async getBackup(backId: Types.ObjectId): Promise<IDBBackupModel> {
    return await DBBackup.findOne({ _id: backId }).exec();
  }

  public static async updateBackupStatus(backId: Types.ObjectId, status: boolean): Promise<void> {
    await DBBackup.findOneAndUpdate(
      { _id: backId },
      {
        $set: {
          status,
        },
      },
      { new: true }
    ).exec();
  }

  public static async addBackup(data: {
    fileName: string;
  }): Promise<IDBBackupModel> {
    const dbBackup = await DBBackup.create(data);

    return dbBackup;
  }

  public static async removeBackup(backupId: Types.ObjectId, filePath?: string): Promise<any> {
    const rs = DBBackup.findOneAndDelete({ _id: backupId }).exec();

    if (!existsSync(filePath)) {
      return null;
    }

    if (rs && filePath) {
      unlinkSync(filePath);
    }

    return rs;
  }
}
